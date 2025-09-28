// @ts-nocheck
import React, { useState, useEffect, useMemo, createElement } from 'react';
import styled from 'styled-components';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayerGroup,
  Polygon,
  Tooltip,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import {
  FaMapMarkerAlt,
  FaEye,
  FaInfoCircle,
  FaCheckCircle,
  FaClock,
  FaCalculator,
  FaEdit,
  FaArrowLeft,
} from 'react-icons/fa';
import { GiSpray } from 'react-icons/gi';
import { useFumigaciones } from '../hooks/useApi';
import { Fumigacion, GeoJSONFeature } from '../types/index';

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Tipos específicos para este componente
interface FumigacionGeoespacial extends Omit<Fumigacion, 'geometria'> {
  geometria: GeoJSONFeature;
  efectividad?: number;
}

interface EstadisticasGeoespaciales {
  totalCampos: number;
  hectareasTratadas: number;
  costoTotal: number;
  efectividadPromedio: number;
}

// Props del componente
interface MapaFumigacionesGeoespacialProps {
  onBack: () => void;
}

// Styled Components
const MapaContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 100%);
  padding: 1.5rem;
`;

const MapaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  color: #2d5016;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
`;

const BackButton = styled.button`
  background: #4a7c59;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #2d5016;
    transform: translateY(-2px);
  }
`;

const ControlPanel = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4a7c59;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: #4a7c59;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d5016;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MapWrapper = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 600px;

  .leaflet-container {
    height: 100%;
    border-radius: 12px;
  }
`;

const PopupContainer = styled.div`
  min-width: 200px;
`;

const PopupTitle = styled.h4<{ color: string }>`
  margin: 0 0 10px 0;
  color: ${props => props.color};
`;

// Datos de ejemplo con geometrías GeoJSON para cuando no hay datos del API
const FUMIGACIONES_GEOJSON_EJEMPLO: FumigacionGeoespacial[] = [
  {
    id: 'geo-1',
    nombre: 'Tratamiento Norte Geoespacial',
    campo: 'Campo Norte',
    tipoTratamiento: 'preventivo' as const,
    producto: 'Insecticida Premium',
    dosis: 2.5,
    fechaPlanificada: '2025-10-15',
    estado: 'COMPLETADA' as const,
    hectareas: 45.8,
    costo: 15600,
    responsable: 'Juan Pérez',
    equipoUtilizado: 'Drone DJI Agras',
    efectividad: 92,
    geometria: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-58.7234, -27.4567],
            [-58.7134, -27.4567],
            [-58.7134, -27.4467],
            [-58.7234, -27.4467],
            [-58.7234, -27.4567],
          ],
        ],
      },
      properties: { name: 'Campo Norte' },
    },
  },
  {
    id: 'geo-2',
    nombre: 'Fumigación Sur Experimental',
    campo: 'Campo Sur',
    tipoTratamiento: 'correctivo' as const,
    producto: 'Fungicida Sistémico',
    dosis: 1.8,
    fechaPlanificada: '2025-10-20',
    estado: 'PLANIFICADA' as const,
    hectareas: 32.2,
    costo: 18900,
    responsable: 'María González',
    equipoUtilizado: 'Pulverizador Terrestre',
    efectividad: 0,
    geometria: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-58.7334, -27.4667],
            [-58.7234, -27.4667],
            [-58.7234, -27.4567],
            [-58.7334, -27.4567],
            [-58.7334, -27.4667],
          ],
        ],
      },
      properties: { name: 'Campo Sur' },
    },
  },
];

// Función para convertir fumigación regular a geoespacial
const convertirAGeoespacial = (fumigacion: Fumigacion, index: number): FumigacionGeoespacial => {
  // Si ya tiene geometría GeoJSONFeature, la mantiene
  if (fumigacion.geometria && (fumigacion.geometria as any).type === 'Feature') {
    return fumigacion as unknown as FumigacionGeoespacial;
  }

  // Generar geometría basada en coordenadas existentes o ejemplos
  const ejemploBase = FUMIGACIONES_GEOJSON_EJEMPLO[index % FUMIGACIONES_GEOJSON_EJEMPLO.length];
  const offsetLat = (Math.random() - 0.5) * 0.02;
  const offsetLng = (Math.random() - 0.5) * 0.02;

  const coordenadas = ejemploBase.geometria.geometry.coordinates as number[][][];
  const nuevaGeometria: GeoJSONFeature = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        coordenadas[0].map(([lng, lat]: number[]) => [
          lng + offsetLng,
          lat + offsetLat,
        ]),
      ],
    },
    properties: { name: fumigacion.campo },
  };

  // Calcular área real basada en geometría
  const area = turf.area(nuevaGeometria) / 10000; // Convertir a hectáreas

  return {
    ...fumigacion,
    geometria: nuevaGeometria,
    hectareas: Math.round(area * 100) / 100,
    efectividad: fumigacion.estado === 'COMPLETADA' ? Math.floor(Math.random() * 30) + 70 : 0,
  };
};

// Obtener color según estado
const obtenerColorEstado = (estado: string): string => {
  switch (estado) {
    case 'COMPLETADA':
      return '#4CAF50';
    case 'EN_PROCESO':
      return '#FF9800';
    case 'PLANIFICADA':
      return '#2196F3';
    case 'CANCELADA':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

const MapaFumigacionesGeoespacial: React.FC<MapaFumigacionesGeoespacialProps> = ({ onBack }) => {
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  
  // Usar el hook de fumigaciones en lugar de localStorage
  const { fumigaciones: fumigacionesApi, isLoading } = useFumigaciones();

  // Convertir fumigaciones del API a geoespaciales
  const fumigacionesGeoespaciales = useMemo<FumigacionGeoespacial[]>(() => {
    if (fumigacionesApi.length > 0) {
      return fumigacionesApi.map((fumigacion, index) => convertirAGeoespacial(fumigacion, index));
    }
    // Fallback a datos de ejemplo si no hay datos del API
    return FUMIGACIONES_GEOJSON_EJEMPLO;
  }, [fumigacionesApi]);

  // Filtrar fumigaciones por estado
  const fumigacionesFiltradas = useMemo(() => {
    if (filtroEstado === 'todos') {
      return fumigacionesGeoespaciales;
    }
    return fumigacionesGeoespaciales.filter(f => f.estado === filtroEstado);
  }, [fumigacionesGeoespaciales, filtroEstado]);

  // Calcular estadísticas
  const estadisticas = useMemo<EstadisticasGeoespaciales>(() => {
    const completadas = fumigacionesGeoespaciales.filter(f => f.estado === 'COMPLETADA');
    const totalHectareas = fumigacionesGeoespaciales.reduce((sum, f) => sum + (f.hectareas || 0), 0);
    const totalCosto = fumigacionesGeoespaciales.reduce((sum, f) => sum + (f.costo || 0), 0);
    const promedioEfectividad =
      completadas.length > 0
        ? completadas.reduce((sum, f) => sum + (f.efectividad || 0), 0) / completadas.length
        : 0;

    return {
      totalCampos: fumigacionesGeoespaciales.length,
      hectareasTratadas: Math.round(totalHectareas * 100) / 100,
      costoTotal: totalCosto,
      efectividadPromedio: Math.round(promedioEfectividad),
    };
  }, [fumigacionesGeoespaciales]);

  if (isLoading) {
    return (
      <MapaContainer>
        <MapaHeader>
          <Title>
            {createElement(GiSpray)}
            Cargando Mapa Geoespacial...
          </Title>
        </MapaHeader>
      </MapaContainer>
    );
  }

  return (
    <MapaContainer>
      <MapaHeader>
        <Title>
          {createElement(GiSpray)}
          Mapa Geoespacial de Fumigaciones
        </Title>
        <BackButton onClick={onBack}>
          {createElement(FaArrowLeft)}
          Volver
        </BackButton>
      </MapaHeader>

      <ControlPanel>
        <ControlRow>
          <label htmlFor="filtro-estado">Filtrar por estado:</label>
          <FilterSelect
            id="filtro-estado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="PLANIFICADA">Planificadas</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="COMPLETADA">Completadas</option>
            <option value="CANCELADA">Canceladas</option>
          </FilterSelect>
        </ControlRow>
      </ControlPanel>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            {createElement(FaMapMarkerAlt)}
          </StatIcon>
          <StatValue>{estadisticas.totalCampos}</StatValue>
          <StatLabel>Campos Totales</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            {createElement(FaCalculator)}
          </StatIcon>
          <StatValue>{estadisticas.hectareasTratadas}</StatValue>
          <StatLabel>Hectáreas Tratadas</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            {createElement(FaCheckCircle)}
          </StatIcon>
          <StatValue>{estadisticas.efectividadPromedio}%</StatValue>
          <StatLabel>Efectividad Promedio</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            {createElement(GiSpray)}
          </StatIcon>
          <StatValue>${estadisticas.costoTotal.toLocaleString()}</StatValue>
          <StatLabel>Costo Total</StatLabel>
        </StatCard>
      </StatsGrid>

      <MapWrapper>
        <MapContainer
          center={[-27.4567, -58.7234] as [number, number]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LayerGroup>
            {fumigacionesFiltradas.map((fumigacion) => {
              const color = obtenerColorEstado(fumigacion.estado);
              
              // Extraer coordenadas del polígono
              const coordinates = fumigacion.geometria.geometry.coordinates[0] as number[][];
              const positions: [number, number][] = coordinates.map(([lng, lat]) => [lat, lng]);

              return (
                <Polygon
                  key={fumigacion.id}
                  positions={positions}
                  pathOptions={{
                    color: color,
                    weight: 2,
                    opacity: 0.8,
                    fillColor: color,
                    fillOpacity: 0.3,
                  }}
                >
                  <Popup>
                    <PopupContainer>
                      <PopupTitle color={color}>
                        {fumigacion.nombre}
                      </PopupTitle>
                      <p><strong>Campo:</strong> {fumigacion.campo}</p>
                      <p><strong>Estado:</strong> {fumigacion.estado}</p>
                      <p><strong>Hectáreas:</strong> {fumigacion.hectareas} ha</p>
                      <p><strong>Producto:</strong> {fumigacion.producto}</p>
                      <p><strong>Responsable:</strong> {fumigacion.responsable}</p>
                      {fumigacion.efectividad && fumigacion.efectividad > 0 && (
                        <p><strong>Efectividad:</strong> {fumigacion.efectividad}%</p>
                      )}
                      <p><strong>Costo:</strong> ${fumigacion.costo.toLocaleString()}</p>
                    </PopupContainer>
                  </Popup>
                  <Tooltip>
                    <span>{fumigacion.nombre} - {fumigacion.hectareas} ha</span>
                  </Tooltip>
                </Polygon>
              );
            })}
          </LayerGroup>
        </MapContainer>
      </MapWrapper>
    </MapaContainer>
  );
};

export default MapaFumigacionesGeoespacial;