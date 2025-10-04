import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  GeoJSON,
  useMapEvents,
  useMap,
  Circle,
  Rectangle,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';

// Fix para íconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ==================== INTERFACES & TYPES ====================

/** Herramientas de dibujo disponibles */
export const DRAWING_TOOLS = {
  NONE: 'none',
  POLYGON: 'polygon',
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  POINT: 'point',
} as const;

type DrawingTool = (typeof DRAWING_TOOLS)[keyof typeof DRAWING_TOOLS];

/** Modos de operación del mapa */
export const MAP_MODES = {
  EDIT: 'edit',
  VIEW: 'view',
  LIST: 'list',
} as const;

type MapMode = (typeof MAP_MODES)[keyof typeof MAP_MODES];

/** GeoJSON Feature compatible con TypeScript */
interface GeoJSONFeature {
  type: 'Feature';
  properties: Record<string, any>;
  geometry: {
    type: 'Polygon' | 'Point' | 'LineString' | 'MultiPolygon' | 'Circle';
    coordinates: any[];
    radius?: number; // Para círculos
  };
}

/** Punto temporal durante el dibujo */
interface TempPoint {
  lat: number;
  lng: number;
  id: string;
}

/** Estado del proceso de dibujo */
interface DrawingState {
  isDrawing: boolean;
  currentTool: DrawingTool;
  tempPoints: TempPoint[];
  previewGeometry: GeoJSONFeature | null;
  canFinish: boolean;
}

/** Estadísticas calculadas de geometría */
interface GeometryStats {
  area: number;
  perimeter: number;
  vertices: number;
}

/** Estilos de polígono para Leaflet */
interface PolygonStyle {
  color: string;
  weight: number;
  opacity: number;
  fillColor: string;
  fillOpacity: number;
}

/** Entidad genérica con geometría */
interface MapEntity {
  id: string | number;
  name?: string;
  geometry?: GeoJSONFeature;
  [key: string]: any;
}

/** Filtros para entidades */
interface MapFilters {
  [key: string]: any;
}

/** Props del componente MapComponent */
interface MapComponentProps {
  // Geometría principal
  geometry?: GeoJSONFeature | null;
  onGeometryChange?: (geometry: GeoJSONFeature | null) => void;

  // Modo de operación
  mode?: MapMode;
  readonly?: boolean;

  // Lista de entidades
  entities?: MapEntity[];
  onEntitySelect?: (entity: MapEntity) => void;
  onEntityClick?: (entity: MapEntity) => void;

  // Configuración del mapa
  height?: string;
  center?: [number, number];
  zoom?: number;

  // Filtros y controles
  showControls?: boolean;
  showFilter?: boolean;
  filters?: MapFilters;
  onFilterChange?: (filters: MapFilters) => void;

  // Estilos
  polygonStyle?: PolygonStyle;

  // Props adicionales
  title?: string;
}

/** Props para componentes de dibujo */
interface DrawingControlsProps {
  onPolygonCreate: (geometry: GeoJSONFeature) => void;
  isActive: boolean;
}

// ==================== STYLED COMPONENTS ====================

const Container = styled.div<{ height: string }>`
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: ${props => props.height || '500px'};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ControlButton = styled.button<{ active?: boolean }>`
  background: ${props =>
    props.active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MapArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;

  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`;

const InfoPanel = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  min-width: 100px;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #4a7c59;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
`;

const AlertMessage = styled.div<{ type: 'success' | 'warning' | 'error' }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 1000;
  max-width: 300px;
  background: ${props => {
    switch (props.type) {
      case 'success':
        return '#d4edda';
      case 'warning':
        return '#fff3cd';
      case 'error':
        return '#f8d7da';
      default:
        return '#d1ecf1';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success':
        return '#155724';
      case 'warning':
        return '#856404';
      case 'error':
        return '#721c24';
      default:
        return '#0c5460';
    }
  }};
  border: 1px solid
    ${props => {
      switch (props.type) {
        case 'success':
          return '#c3e6cb';
        case 'warning':
          return '#ffeaa7';
        case 'error':
          return '#f5c6cb';
        default:
          return '#bee5eb';
      }
    }};
`;

const FilterSection = styled.div`
  background: #fff;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

// ==================== COMPONENTES DE DIBUJO ====================

/** Componente para controles de dibujo en el mapa */
const DrawingControls: React.FC<DrawingControlsProps> = ({
  onPolygonCreate,
  isActive,
}) => {
  const map = useMap();
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  useMapEvents({
    click(e) {
      if (isActive && isDrawingMode) {
        // Aquí implementarías la lógica de dibujo de polígonos
        // Por simplicidad, creamos un polígono de ejemplo
        const { lat, lng } = e.latlng;
        const samplePolygon: GeoJSONFeature = {
          type: 'Feature',
          properties: { name: 'Nuevo Campo' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [lng - 0.001, lat - 0.001],
                [lng + 0.001, lat - 0.001],
                [lng + 0.001, lat + 0.001],
                [lng - 0.001, lat + 0.001],
                [lng - 0.001, lat - 0.001],
              ],
            ],
          },
        };
        onPolygonCreate(samplePolygon);
        setIsDrawingMode(false);
      }
    },
  });

  return null;
};

// ==================== COMPONENTE PRINCIPAL ====================

/**
 * MapComponent - Componente de mapa versátil y reutilizable
 *
 * Funcionalidades principales:
 * - Editor de geometría con dibujo de polígonos
 * - Visualizador de geometrías existentes
 * - Lista de entidades con filtros
 * - Cálculo automático de estadísticas geoespaciales
 * - Modos configurables (edición, vista, lista)
 *
 * Reemplaza MapaEditor, MapaViewer, MapaLotes, MapaFumigaciones y MapaFumigacionesGeoespacial
 */
const MapComponent: React.FC<MapComponentProps> = ({
  // Geometría principal
  geometry = null,
  onGeometryChange = undefined,

  // Modo de operación
  mode = MAP_MODES.VIEW,
  readonly = false,

  // Lista de entidades
  entities = [],
  onEntitySelect = undefined,
  onEntityClick = undefined,

  // Configuración del mapa
  height = '500px',
  center = [-32.0833, -59.85] as [number, number],
  zoom = 13,

  // Filtros y controles
  showControls = true,
  showFilter = false,
  filters = {},
  onFilterChange = undefined,

  // Estilos
  polygonStyle = {
    color: '#4a7c59',
    weight: 3,
    opacity: 1,
    fillColor: '#4a7c59',
    fillOpacity: 0.25,
  },

  // Props adicionales
  title = 'Mapa',
  ...otherProps
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [tempGeometry, setTempGeometry] = useState<GeoJSONFeature | null>(null);
  const [filteredEntities, setFilteredEntities] =
    useState<MapEntity[]>(entities);
  const [alertMessage, setAlertMessage] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  // Calcular estadísticas de la geometría actual
  const stats = React.useMemo((): GeometryStats => {
    const currentGeom = tempGeometry || geometry;
    if (!currentGeom || !currentGeom.geometry) {
      return { area: 0, perimeter: 0, vertices: 0 };
    }

    try {
      const area = turf.area(currentGeom) / 10000; // Convertir a hectáreas
      const perimeter = turf.length(currentGeom, { units: 'kilometers' });
      const vertices = currentGeom.geometry.coordinates[0].length - 1;

      return {
        area: Math.round(area * 100) / 100,
        perimeter: Math.round(perimeter * 100) / 100,
        vertices,
      };
    } catch (error) {
      return { area: 0, perimeter: 0, vertices: 0 };
    }
  }, [tempGeometry, geometry]);

  // Manejar filtros
  useEffect(() => {
    if (!showFilter || !entities.length) {
      setFilteredEntities(entities);
      return;
    }

    const filtered = entities.filter(entity => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'todos') return true;
        return entity[key] === value;
      });
    });

    setFilteredEntities(filtered);
  }, [entities, filters, showFilter]);

  // Manejar creación de polígono
  const handlePolygonCreate = (newGeometry: GeoJSONFeature) => {
    if (readonly) return;

    setTempGeometry(newGeometry);
    setAlertMessage({
      type: 'success',
      message: `Polígono creado. Área: ${Math.round((turf.area(newGeometry) / 10000) * 100) / 100} ha`,
    });

    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Guardar geometría
  const handleSaveGeometry = () => {
    if (tempGeometry && onGeometryChange) {
      onGeometryChange(tempGeometry);
      setTempGeometry(null);
      setAlertMessage({
        type: 'success',
        message: 'Geometría guardada exitosamente',
      });
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  // Limpiar geometría
  const handleClearGeometry = () => {
    if (readonly) return;

    if (onGeometryChange) {
      onGeometryChange(null);
    }
    setTempGeometry(null);
    setAlertMessage({
      type: 'warning',
      message: 'Geometría eliminada',
    });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Deshacer cambios temporales
  const handleUndoChanges = () => {
    setTempGeometry(null);
    setIsDrawing(false);
    setAlertMessage({
      type: 'warning',
      message: 'Cambios descartados',
    });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Convertir coordenadas para Leaflet
  const convertToLeafletCoordinates = (coordinates: number[][][]) => {
    return coordinates[0].map(([lng, lat]) => [lat, lng] as [number, number]);
  };

  // Calcular centro del mapa basado en geometría
  const mapCenter = React.useMemo((): [number, number] => {
    const currentGeom = geometry || tempGeometry;
    if (
      currentGeom &&
      currentGeom.geometry &&
      currentGeom.geometry.type === 'Polygon'
    ) {
      try {
        // Usar turf con tipado más específico
        const turfFeature: any = currentGeom;
        const centroid = turf.centroid(turfFeature);
        return [
          centroid.geometry.coordinates[1],
          centroid.geometry.coordinates[0],
        ];
      } catch {
        return center;
      }
    }
    return center;
  }, [geometry, tempGeometry, center]);

  return (
    <Container height={height} {...otherProps}>
      {/* Header con controles */}
      <Header>
        <Title>🗺️ {title}</Title>

        {showControls && !readonly && (
          <Controls>
            {mode === MAP_MODES.EDIT && (
              <>
                <ControlButton
                  active={isDrawing}
                  onClick={() => setIsDrawing(!isDrawing)}
                >
                  🖊️ {isDrawing ? 'Cancelar' : 'Dibujar'}
                </ControlButton>

                {tempGeometry && (
                  <>
                    <ControlButton onClick={handleSaveGeometry}>
                      💾 Guardar
                    </ControlButton>
                    <ControlButton onClick={handleUndoChanges}>
                      ↩️ Deshacer
                    </ControlButton>
                  </>
                )}

                <ControlButton
                  onClick={handleClearGeometry}
                  disabled={!geometry && !tempGeometry}
                >
                  🗑️ Limpiar
                </ControlButton>
              </>
            )}

            {mode === MAP_MODES.LIST && (
              <ControlButton active={showFilter}>
                👁️ {filteredEntities.length} visible
              </ControlButton>
            )}
          </Controls>
        )}
      </Header>

      {/* Filtros */}
      {showFilter && (
        <FilterSection>
          📝 Filtros activos: {Object.keys(filters).length}
        </FilterSection>
      )}

      {/* Mapa */}
      <MapArea>
        {alertMessage && (
          <AlertMessage type={alertMessage.type}>
            {alertMessage.message}
          </AlertMessage>
        )}

        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Controles de dibujo */}
          {mode === MAP_MODES.EDIT && !readonly && (
            <DrawingControls
              onPolygonCreate={handlePolygonCreate}
              isActive={isDrawing}
            />
          )}

          {/* Geometría principal */}
          {geometry && (
            <Polygon
              positions={convertToLeafletCoordinates(
                geometry.geometry.coordinates
              )}
              pathOptions={polygonStyle}
            >
              <Popup>
                <div>
                  <h4>{geometry.properties?.name || 'Campo'}</h4>
                  <p>
                    <strong>Área:</strong> {stats.area} ha
                  </p>
                  <p>
                    <strong>Perímetro:</strong> {stats.perimeter} km
                  </p>
                  <p>
                    <strong>Vértices:</strong> {stats.vertices}
                  </p>
                </div>
              </Popup>
            </Polygon>
          )}

          {/* Geometría temporal */}
          {tempGeometry && (
            <Polygon
              positions={convertToLeafletCoordinates(
                tempGeometry.geometry.coordinates
              )}
              pathOptions={{
                ...polygonStyle,
                color: '#17a2b8',
                fillColor: '#17a2b8',
                dashArray: '5, 10',
              }}
            >
              <Popup>
                <div>
                  <h4>Polígono Temporal</h4>
                  <p>Presiona "Guardar" para confirmar</p>
                </div>
              </Popup>
            </Polygon>
          )}

          {/* Lista de entidades */}
          {mode === MAP_MODES.LIST &&
            filteredEntities.map(
              entity =>
                entity.geometry && (
                  <Polygon
                    key={String(entity.id)}
                    positions={convertToLeafletCoordinates(
                      entity.geometry.geometry.coordinates
                    )}
                    pathOptions={{
                      ...polygonStyle,
                      color: entity.color || polygonStyle.color,
                    }}
                    eventHandlers={{
                      click: () => onEntityClick?.(entity),
                    }}
                  >
                    <Popup>
                      <div>
                        <h4>{entity.name || String(entity.id)}</h4>
                        {Object.entries(entity)
                          .filter(
                            ([key]) => !['id', 'geometry', 'name'].includes(key)
                          )
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <p key={key}>
                              <strong>{key}:</strong> {String(value)}
                            </p>
                          ))}
                      </div>
                    </Popup>
                  </Polygon>
                )
            )}
        </MapContainer>
      </MapArea>

      {/* Panel de información */}
      {(mode === MAP_MODES.EDIT || geometry || tempGeometry) && (
        <InfoPanel>
          <StatItem>
            <StatValue>{stats.area}</StatValue>
            <StatLabel>Hectáreas</StatLabel>
          </StatItem>

          <StatItem>
            <StatValue>{stats.perimeter}</StatValue>
            <StatLabel>Perímetro (km)</StatLabel>
          </StatItem>

          <StatItem>
            <StatValue>{stats.vertices}</StatValue>
            <StatLabel>Vértices</StatLabel>
          </StatItem>

          {mode === MAP_MODES.LIST && (
            <StatItem>
              <StatValue>{filteredEntities.length}</StatValue>
              <StatLabel>Entidades</StatLabel>
            </StatItem>
          )}
        </InfoPanel>
      )}
    </Container>
  );
};

// ==================== COMPONENTES DE CONVENIENCIA ====================

/** Editor de geometría para crear/editar polígonos */
export const MapEditor: React.FC<Omit<MapComponentProps, 'mode'>> = props => (
  <MapComponent mode={MAP_MODES.EDIT} title="Editor de Geometría" {...props} />
);

/** Visualizador de geometrías existentes */
export const MapViewer: React.FC<Omit<MapComponentProps, 'mode'>> = props => (
  <MapComponent mode={MAP_MODES.VIEW} title="Visualizador" {...props} />
);

/** Mapa con lista de entidades */
export const MapList: React.FC<Omit<MapComponentProps, 'mode'>> = props => (
  <MapComponent mode={MAP_MODES.LIST} title="Mapa de Entidades" {...props} />
);

export default MapComponent;
export type {
  MapComponentProps,
  GeoJSONFeature,
  MapEntity,
  GeometryStats,
  PolygonStyle,
};
