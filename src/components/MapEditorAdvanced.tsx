import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  useMapEvents,
  useMap,
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
  EDIT: 'edit',
} as const;

type DrawingTool = (typeof DRAWING_TOOLS)[keyof typeof DRAWING_TOOLS];

/** GeoJSON Feature estándar */
interface GeoJSONFeature {
  type: 'Feature';
  properties: Record<string, any>;
  geometry: {
    type: 'Polygon' | 'Point' | 'LineString';
    coordinates: number[][][] | number[][] | number[];
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

/** Vértice editable */
interface EditableVertex {
  lat: number;
  lng: number;
  id: string;
  index: number;
}

/** Punto medio en arista */
interface MidPoint {
  lat: number;
  lng: number;
  id: string;
  beforeIndex: number;
  afterIndex: number;
}

/** Estado de edición */
interface EditingState {
  isEditing: boolean;
  editableVertices: EditableVertex[];
  midPoints: MidPoint[];
  originalGeometry: GeoJSONFeature | null;
  draggedVertexId: string | null;
}

/** Props del MapEditorAdvanced */
interface MapEditorAdvancedProps {
  geometry?: GeoJSONFeature | null;
  onGeometryChange?: (geometry: GeoJSONFeature | null) => void;
  height?: string;
  showStats?: boolean;
  title?: string;
  disabled?: boolean;
}

// ==================== STYLED COMPONENTS ====================

const Container = styled.div<{ height: string }>`
  width: 100%;
  height: ${props => props.height || '400px'};
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  background: #f8f9fa;
  position: relative;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ToolsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ToolButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  background: ${props =>
    props.active
      ? 'rgba(255,255,255,0.9)'
      : props.disabled
        ? 'rgba(255,255,255,0.3)'
        : 'rgba(255,255,255,0.2)'};
  color: ${props =>
    props.active
      ? '#4a7c59'
      : props.disabled
        ? 'rgba(255,255,255,0.5)'
        : 'white'};
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ActionButton = styled(ToolButton)<{ variant?: 'danger' | 'success' }>`
  background: ${props => {
    if (props.variant === 'danger') return 'rgba(244, 67, 54, 0.8)';
    if (props.variant === 'success') return 'rgba(76, 175, 80, 0.8)';
    return 'rgba(255,255,255,0.2)';
  }};
  color: white;

  &:hover:not(:disabled) {
    background: ${props => {
      if (props.variant === 'danger') return 'rgba(244, 67, 54, 1)';
      if (props.variant === 'success') return 'rgba(76, 175, 80, 1)';
      return 'rgba(255,255,255,0.3)';
    }};
  }
`;

const MapWrapper = styled.div`
  height: calc(100% - 140px);
  position: relative;

  .leaflet-container {
    height: 100% !important;
    width: 100% !important;
  }

  .temp-marker {
    background: transparent !important;
    border: none !important;
  }

  .marker-inner {
    background: #ff6b35;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const StatsContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  padding: 0.75rem;
  display: flex;
  justify-content: space-around;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const StatItem = styled.div`
  text-align: center;
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #4a7c59;
  line-height: 1.2;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InstructionsOverlay = styled.div<{ show: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(74, 124, 89, 0.9);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
  max-width: 300px;
  z-index: 1000;
  transition: all 0.3s ease;
  opacity: ${props => (props.show ? 1 : 0)};
  pointer-events: ${props => (props.show ? 'auto' : 'none')};
`;

const InstructionTitle = styled.div`
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const InstructionText = styled.div`
  line-height: 1.4;
`;

const MarkerInner = styled.div`
  background: #ff6b35;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const EditableVertexMarker = styled.div`
  background: #4a7c59;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  border: 3px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  cursor: grab;
  transition: all 0.2s ease;

  &:hover {
    background: #6b8e23;
    transform: scale(1.2);
  }

  &:active {
    cursor: grabbing;
    transform: scale(1.1);
  }
`;

const MidPointMarker = styled.div`
  background: #ff9500;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;

  &:hover {
    background: #ffab33;
    opacity: 1;
    transform: scale(1.3);
  }
`;

const EditControls = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const EditButton = styled.button<{
  variant?: 'danger' | 'success' | 'warning';
}>`
  background: ${props =>
    props.variant === 'danger'
      ? '#dc3545'
      : props.variant === 'success'
        ? '#28a745'
        : props.variant === 'warning'
          ? '#ffc107'
          : '#007bff'};
  color: ${props => (props.variant === 'warning' ? '#212529' : 'white')};
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.6rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// ==================== HELPER FUNCTIONS ====================

/** Calcular estadísticas de geometría */
const calculateStats = (geometry: GeoJSONFeature | null): GeometryStats => {
  if (!geometry || !geometry.geometry) {
    return { area: 0, perimeter: 0, vertices: 0 };
  }

  try {
    const area = turf.area(geometry) / 10000; // m² a hectáreas
    const perimeter = turf.length(geometry); // km
    const coords = geometry.geometry.coordinates as number[][][];
    const vertices = coords[0] ? coords[0].length - 1 : 0;

    return {
      area: Math.round(area * 100) / 100,
      perimeter: Math.round(perimeter * 100) / 100,
      vertices,
    };
  } catch (error) {
    return { area: 0, perimeter: 0, vertices: 0 };
  }
};

/** Convertir puntos temporales a GeoJSON */
const pointsToGeoJSON = (points: TempPoint[]): GeoJSONFeature | null => {
  if (points.length < 3) return null;

  const coordinates = points.map(p => [p.lng, p.lat]);
  coordinates.push([points[0].lng, points[0].lat]); // Cerrar polígono

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates],
    },
  };
};

/** Generar ID único */
const generateId = () =>
  `point_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/** Extraer vértices editables de geometría */
const extractVerticesFromGeometry = (
  geometry: GeoJSONFeature | null
): EditableVertex[] => {
  if (!geometry || geometry.geometry.type !== 'Polygon') return [];

  const coords = geometry.geometry.coordinates as number[][][];
  if (!coords[0] || coords[0].length < 4) return [];

  // Excluir el último punto (duplicado del primero)
  return coords[0].slice(0, -1).map((coord, index) => ({
    lat: coord[1],
    lng: coord[0],
    id: `vertex_${index}`,
    index,
  }));
};

/** Calcular puntos medios en aristas */
const calculateMidPoints = (vertices: EditableVertex[]): MidPoint[] => {
  if (vertices.length < 3) return [];

  const midPoints: MidPoint[] = [];
  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];

    const midLat = (current.lat + next.lat) / 2;
    const midLng = (current.lng + next.lng) / 2;

    midPoints.push({
      lat: midLat,
      lng: midLng,
      id: `mid_${i}_${(i + 1) % vertices.length}`,
      beforeIndex: i,
      afterIndex: (i + 1) % vertices.length,
    });
  }

  return midPoints;
};

/** Convertir vértices editables a GeoJSON */
const verticesToGeoJSON = (
  vertices: EditableVertex[]
): GeoJSONFeature | null => {
  if (vertices.length < 3) return null;

  const coordinates = vertices.map(v => [v.lng, v.lat]);
  coordinates.push([vertices[0].lng, vertices[0].lat]); // Cerrar polígono

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates],
    },
  };
};

// ==================== MAP DRAWING COMPONENT ====================

/** Componente para vértice editable */
const EditableVertexComponent: React.FC<{
  vertex: EditableVertex;
  onVertexMove: (
    vertex: EditableVertex,
    newLat: number,
    newLng: number
  ) => void;
  onVertexDelete?: (vertex: EditableVertex) => void;
}> = ({ vertex, onVertexMove, onVertexDelete }) => {
  const eventHandlers = {
    dragend: (e: any) => {
      const { lat, lng } = e.target.getLatLng();
      onVertexMove(vertex, lat, lng);
    },
  };

  const customIcon = L.divIcon({
    className: 'custom-vertex-icon',
    html: `<div style="
      background: #4a7c59;
      color: white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      cursor: grab;
      transition: all 0.2s ease;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <Marker
      position={[vertex.lat, vertex.lng]}
      icon={customIcon}
      draggable={true}
      eventHandlers={eventHandlers}
    />
  );
};

/** Componente para punto medio en arista */
const MidPointComponent: React.FC<{
  midPoint: MidPoint;
  onMidPointClick: (midPoint: MidPoint) => void;
}> = ({ midPoint, onMidPointClick }) => {
  const customIcon = L.divIcon({
    className: 'custom-midpoint-icon',
    html: `<div style="
      background: #ff9500;
      border-radius: 50%;
      width: 12px;
      height: 12px;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      opacity: 0.7;
      transition: all 0.2s ease;
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

  const eventHandlers = {
    click: () => {
      onMidPointClick(midPoint);
    },
  };

  return (
    <Marker
      position={[midPoint.lat, midPoint.lng]}
      icon={customIcon}
      eventHandlers={eventHandlers}
    />
  );
};

/** Componente que maneja el dibujo en el mapa */
const MapDrawingHandler: React.FC<{
  drawingState: DrawingState;
  onDrawingStateChange: (state: Partial<DrawingState>) => void;
  onPointAdd: (point: TempPoint) => void;
  onFinishDrawing: () => void;
  disabled?: boolean;
}> = ({
  drawingState,
  onDrawingStateChange,
  onPointAdd,
  onFinishDrawing,
  disabled,
}) => {
  useMapEvents({
    click: e => {
      if (disabled || drawingState.currentTool === DRAWING_TOOLS.NONE) return;

      const { lat, lng } = e.latlng;
      const newPoint: TempPoint = {
        lat,
        lng,
        id: generateId(),
      };

      if (drawingState.currentTool === DRAWING_TOOLS.POLYGON) {
        onPointAdd(newPoint);

        // Verificar si se puede finalizar (mínimo 3 puntos)
        const totalPoints = drawingState.tempPoints.length + 1;
        if (totalPoints >= 3) {
          onDrawingStateChange({ canFinish: true });
        }
      }
    },

    mousemove: e => {
      if (
        disabled ||
        drawingState.currentTool !== DRAWING_TOOLS.POLYGON ||
        drawingState.tempPoints.length === 0
      ) {
        return;
      }

      // Crear previsualización con el punto actual del mouse
      const previewPoints = [
        ...drawingState.tempPoints,
        { lat: e.latlng.lat, lng: e.latlng.lng, id: 'preview' },
      ];

      if (previewPoints.length >= 3) {
        const previewGeom = pointsToGeoJSON(previewPoints);
        onDrawingStateChange({ previewGeometry: previewGeom });
      }
    },
  });

  return null;
};

// ==================== MAIN COMPONENT ====================

export const MapEditorAdvanced: React.FC<MapEditorAdvancedProps> = ({
  geometry = null,
  onGeometryChange,
  height = '600px',
  showStats = true,
  title = '🗺️ Editor de Geometría Avanzado',
  disabled = false,
}) => {
  // Estados
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    currentTool: DRAWING_TOOLS.NONE,
    tempPoints: [],
    previewGeometry: null,
    canFinish: false,
  });

  const [editingState, setEditingState] = useState<EditingState>({
    isEditing: false,
    editableVertices: [],
    midPoints: [],
    originalGeometry: null,
    draggedVertexId: null,
  });

  const [stats, setStats] = useState<GeometryStats>({
    area: 0,
    perimeter: 0,
    vertices: 0,
  });
  const [showInstructions, setShowInstructions] = useState(false);

  // Refs
  const mapRef = useRef<L.Map>(null);

  // Calcular estadísticas cuando cambie la geometría
  useEffect(() => {
    setStats(calculateStats(geometry));
  }, [geometry]);

  // Handlers
  const handleToolSelect = useCallback(
    (tool: DrawingTool) => {
      if (disabled) return;

      // Si selecciona EDIT, preparar modo edición
      if (tool === DRAWING_TOOLS.EDIT) {
        if (geometry) {
          const vertices = extractVerticesFromGeometry(geometry);
          const midPoints = calculateMidPoints(vertices);
          setEditingState({
            isEditing: true,
            editableVertices: vertices,
            midPoints,
            originalGeometry: geometry,
            draggedVertexId: null,
          });
        }
        setDrawingState(prev => ({
          ...prev,
          currentTool: tool,
          isDrawing: false,
          tempPoints: [],
          previewGeometry: null,
          canFinish: false,
        }));
      } else {
        // Si sale del modo EDIT, limpiar estado de edición
        if (drawingState.currentTool === DRAWING_TOOLS.EDIT) {
          setEditingState({
            isEditing: false,
            editableVertices: [],
            midPoints: [],
            originalGeometry: null,
            draggedVertexId: null,
          });
        }

        setDrawingState(prev => ({
          ...prev,
          currentTool: tool,
          isDrawing: tool !== DRAWING_TOOLS.NONE,
          tempPoints: tool === DRAWING_TOOLS.NONE ? [] : prev.tempPoints,
          previewGeometry:
            tool === DRAWING_TOOLS.NONE ? null : prev.previewGeometry,
          canFinish: false,
        }));
      }

      setShowInstructions(tool === DRAWING_TOOLS.POLYGON);
    },
    [disabled]
  );

  const handlePointAdd = useCallback((point: TempPoint) => {
    setDrawingState(prev => ({
      ...prev,
      tempPoints: [...prev.tempPoints, point],
    }));
  }, []);

  const handleFinishDrawing = useCallback(() => {
    if (drawingState.tempPoints.length >= 3) {
      const newGeometry = pointsToGeoJSON(drawingState.tempPoints);
      onGeometryChange?.(newGeometry);

      // Reset estado
      setDrawingState({
        isDrawing: false,
        currentTool: DRAWING_TOOLS.NONE,
        tempPoints: [],
        previewGeometry: null,
        canFinish: false,
      });
      setShowInstructions(false);
    }
  }, [drawingState.tempPoints, onGeometryChange]);

  const handleClear = useCallback(() => {
    onGeometryChange?.(null);
    setDrawingState({
      isDrawing: false,
      currentTool: DRAWING_TOOLS.NONE,
      tempPoints: [],
      previewGeometry: null,
      canFinish: false,
    });
    setShowInstructions(false);
  }, [onGeometryChange]);

  const handleUndo = useCallback(() => {
    setDrawingState(prev => ({
      ...prev,
      tempPoints: prev.tempPoints.slice(0, -1),
      canFinish: prev.tempPoints.length > 3, // -1 punto
      previewGeometry: null,
    }));
  }, []);

  const handleDrawingStateChange = useCallback(
    (changes: Partial<DrawingState>) => {
      setDrawingState(prev => ({ ...prev, ...changes }));
    },
    []
  );

  // ==================== EDITING HANDLERS ====================

  const handleVertexMove = useCallback(
    (vertex: EditableVertex, newLat: number, newLng: number) => {
      setEditingState(prev => {
        const updatedVertices = prev.editableVertices.map(v =>
          v.id === vertex.id ? { ...v, lat: newLat, lng: newLng } : v
        );

        const newGeometry = verticesToGeoJSON(updatedVertices);
        if (newGeometry && onGeometryChange) {
          onGeometryChange(newGeometry);
        }

        return {
          ...prev,
          editableVertices: updatedVertices,
          midPoints: calculateMidPoints(updatedVertices),
        };
      });
    },
    [onGeometryChange]
  );

  const handleMidPointClick = useCallback(
    (midPoint: MidPoint) => {
      setEditingState(prev => {
        const newVertex: EditableVertex = {
          lat: midPoint.lat,
          lng: midPoint.lng,
          id: `vertex_new_${Date.now()}`,
          index: midPoint.afterIndex,
        };

        // Insertar el nuevo vértice en la posición correcta
        const updatedVertices = [
          ...prev.editableVertices.slice(0, midPoint.afterIndex),
          newVertex,
          ...prev.editableVertices.slice(midPoint.afterIndex),
        ];

        // Reindexar los vértices
        const reindexedVertices = updatedVertices.map((v, index) => ({
          ...v,
          index,
          id: `vertex_${index}`,
        }));

        const newGeometry = verticesToGeoJSON(reindexedVertices);
        if (newGeometry && onGeometryChange) {
          onGeometryChange(newGeometry);
        }

        return {
          ...prev,
          editableVertices: reindexedVertices,
          midPoints: calculateMidPoints(reindexedVertices),
        };
      });
    },
    [onGeometryChange]
  );

  const handleVertexDelete = useCallback(
    (vertex: EditableVertex) => {
      if (editingState.editableVertices.length <= 3) return; // No eliminar si quedan menos de 3 vértices

      setEditingState(prev => {
        const updatedVertices = prev.editableVertices
          .filter(v => v.id !== vertex.id)
          .map((v, index) => ({
            ...v,
            index,
            id: `vertex_${index}`,
          }));

        const newGeometry = verticesToGeoJSON(updatedVertices);
        if (newGeometry && onGeometryChange) {
          onGeometryChange(newGeometry);
        }

        return {
          ...prev,
          editableVertices: updatedVertices,
          midPoints: calculateMidPoints(updatedVertices),
        };
      });
    },
    [editingState.editableVertices.length, onGeometryChange]
  );

  const handleEditingCancel = useCallback(() => {
    if (editingState.originalGeometry && onGeometryChange) {
      onGeometryChange(editingState.originalGeometry);
    }
    setEditingState({
      isEditing: false,
      editableVertices: [],
      midPoints: [],
      originalGeometry: null,
      draggedVertexId: null,
    });
    setDrawingState(prev => ({
      ...prev,
      currentTool: DRAWING_TOOLS.NONE,
    }));
  }, [editingState.originalGeometry, onGeometryChange]);

  const handleEditingConfirm = useCallback(() => {
    setEditingState({
      isEditing: false,
      editableVertices: [],
      midPoints: [],
      originalGeometry: null,
      draggedVertexId: null,
    });
    setDrawingState(prev => ({
      ...prev,
      currentTool: DRAWING_TOOLS.NONE,
    }));
  }, []);

  // Centro del mapa
  const mapCenter: [number, number] = React.useMemo(() => {
    if (geometry?.geometry && geometry.geometry.type === 'Polygon') {
      try {
        const centroid = turf.centroid(geometry as any);
        return [
          centroid.geometry.coordinates[1],
          centroid.geometry.coordinates[0],
        ];
      } catch {
        return [-32.0, -60.0]; // Default
      }
    }
    return [-32.0, -60.0];
  }, [geometry]);

  return (
    <Container height={height}>
      {/* Header con herramientas */}
      <Header>
        <Title>{title}</Title>

        <ToolsContainer>
          <ToolButton
            active={drawingState.currentTool === DRAWING_TOOLS.POLYGON}
            onClick={() => handleToolSelect(DRAWING_TOOLS.POLYGON)}
            disabled={disabled}
          >
            📐 Polígono
          </ToolButton>

          <ToolButton
            active={drawingState.currentTool === DRAWING_TOOLS.EDIT}
            onClick={() => handleToolSelect(DRAWING_TOOLS.EDIT)}
            disabled={disabled || !geometry}
          >
            ✏️ Editar
          </ToolButton>

          {drawingState.currentTool === DRAWING_TOOLS.EDIT &&
            editingState.isEditing && (
              <EditControls>
                <EditButton variant="success" onClick={handleEditingConfirm}>
                  ✓ Confirmar
                </EditButton>
                <EditButton variant="danger" onClick={handleEditingCancel}>
                  ✖ Cancelar
                </EditButton>
              </EditControls>
            )}

          <ToolButton
            disabled={drawingState.tempPoints.length === 0}
            onClick={handleUndo}
          >
            ↶ Deshacer
          </ToolButton>

          <ActionButton
            variant="success"
            disabled={!drawingState.canFinish}
            onClick={handleFinishDrawing}
          >
            ✓ Finalizar
          </ActionButton>

          <ActionButton
            variant="danger"
            disabled={!geometry && drawingState.tempPoints.length === 0}
            onClick={handleClear}
          >
            🗑️ Limpiar
          </ActionButton>
        </ToolsContainer>
      </Header>

      {/* Mapa */}
      <MapWrapper>
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Handler de dibujo */}
          <MapDrawingHandler
            drawingState={drawingState}
            onDrawingStateChange={handleDrawingStateChange}
            onPointAdd={handlePointAdd}
            onFinishDrawing={handleFinishDrawing}
            disabled={disabled}
          />

          {/* Geometría final */}
          {geometry &&
            geometry.geometry &&
            geometry.geometry.type === 'Polygon' && (
              <Polygon
                positions={(geometry.geometry.coordinates[0] as number[][]).map(
                  ([lng, lat]: number[]) => [lat, lng]
                )}
                pathOptions={{
                  color: '#4a7c59',
                  fillColor: '#4a7c59',
                  fillOpacity: 0.3,
                  weight: 3,
                }}
              />
            )}

          {/* Geometría de previsualización */}
          {drawingState.previewGeometry &&
            drawingState.previewGeometry.geometry &&
            drawingState.previewGeometry.geometry.type === 'Polygon' && (
              <Polygon
                positions={(
                  drawingState.previewGeometry.geometry
                    .coordinates[0] as number[][]
                ).map(([lng, lat]: number[]) => [lat, lng])}
                pathOptions={{
                  color: '#ff6b35',
                  fillColor: '#ff6b35',
                  fillOpacity: 0.2,
                  weight: 2,
                  dashArray: '5, 10',
                }}
              />
            )}

          {/* Puntos temporales */}
          {drawingState.tempPoints.map((point, index) => (
            <Marker
              key={point.id}
              position={[point.lat, point.lng]}
              icon={L.divIcon({
                className: 'temp-marker',
                html: `<div class="marker-inner">${index + 1}</div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              })}
            />
          ))}

          {/* Vértices editables en modo edición */}
          {editingState.isEditing &&
            editingState.editableVertices.map(vertex => (
              <EditableVertexComponent
                key={vertex.id}
                vertex={vertex}
                onVertexMove={handleVertexMove}
                onVertexDelete={handleVertexDelete}
              />
            ))}

          {/* Puntos medios en modo edición */}
          {editingState.isEditing &&
            editingState.midPoints.map(midPoint => (
              <MidPointComponent
                key={midPoint.id}
                midPoint={midPoint}
                onMidPointClick={handleMidPointClick}
              />
            ))}
        </MapContainer>

        {/* Instrucciones */}
        <InstructionsOverlay show={showInstructions}>
          <InstructionTitle>📐 Modo Polígono Activo</InstructionTitle>
          <InstructionText>
            Haz clic en el mapa para agregar puntos.
            <br />
            Mínimo 3 puntos para crear un polígono.
            <br />
            Presiona "Finalizar" cuando termines.
          </InstructionText>
        </InstructionsOverlay>
      </MapWrapper>

      {/* Estadísticas */}
      {showStats && (
        <StatsContainer>
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
        </StatsContainer>
      )}
    </Container>
  );
};

export default MapEditorAdvanced;
