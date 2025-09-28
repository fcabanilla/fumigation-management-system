import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayerGroup,
  Polygon,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import {
  FaMapMarkerAlt,
  FaEye,
  FaInfoCircle,
  FaCheckCircle,
  FaClock,
  FaCalculator,
  FaEdit,
} from "react-icons/fa";
import { GiSpray } from "react-icons/gi";

// Fix para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.8rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    justify-content: center;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FilterButton = styled.button`
  background: ${(props) => (props.active ? "var(--primary-color)" : "white")};
  color: ${(props) => (props.active ? "white" : "var(--primary-color)")};
  border: 2px solid var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 124, 89, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

const MapWrapper = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  height: 70vh;
  position: relative;

  .leaflet-container {
    height: 100%;
    width: 100%;
    border-radius: 15px;
  }

  @media (max-width: 768px) {
    height: 60vh;
    margin: 0 -0.5rem;
    border-radius: 10px;
  }
`;

const LeyendaContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 200px;

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    right: 0;
    margin-top: 1rem;
    max-width: none;
  }
`;

const LeyendaTitulo = styled.h3`
  color: var(--primary-color);
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LeyendaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.3rem 0;
  font-size: 0.85rem;
  color: var(--text-color);
`;

const ColorIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${(props) => props.color};
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
`;

const EstadisticasContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.5rem;
  }
`;

const EstadisticaCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const EstadisticaValor = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const EstadisticaLabel = styled.div`
  color: var(--text-color);
  font-size: 0.9rem;
  opacity: 0.8;
`;

// Colores por estado
const ESTADO_COLORES = {
  completada: "#28a745",
  pendiente: "#ffc107",
  "en-proceso": "#17a2b8",
  cancelada: "#dc3545",
};

// Datos de ejemplo con geometrías GeoJSON reales
const FUMIGACIONES_GEOJSON = [
  {
    id: 1,
    titulo: "Campo Norte - Herbicida",
    estado: "completada",
    tipo: "Herbicida",
    fecha: "2024-01-15",
    cultivo: "Soja",
    costo: 15000,
    efectividad: 92,
    geometria: {
      type: "Feature",
      properties: {
        nombre: "Campo Norte",
        cultivo: "Soja",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-58.3816, -34.6037],
            [-58.38, -34.6037],
            [-58.38, -34.602],
            [-58.3816, -34.602],
            [-58.3816, -34.6037],
          ],
        ],
      },
    },
  },
  {
    id: 2,
    titulo: "Lote Sur - Insecticida",
    estado: "pendiente",
    tipo: "Insecticida",
    fecha: "2024-01-20",
    cultivo: "Maíz",
    costo: 12000,
    efectividad: null,
    geometria: {
      type: "Feature",
      properties: {
        nombre: "Lote Sur",
        cultivo: "Maíz",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-58.396, -34.6118],
            [-58.394, -34.6118],
            [-58.394, -34.61],
            [-58.396, -34.61],
            [-58.396, -34.6118],
          ],
        ],
      },
    },
  },
  {
    id: 3,
    titulo: "Parcela Este - Fungicida",
    estado: "en-proceso",
    tipo: "Fungicida",
    fecha: "2024-01-18",
    cultivo: "Trigo",
    costo: 22000,
    efectividad: null,
    geometria: {
      type: "Feature",
      properties: {
        nombre: "Parcela Este",
        cultivo: "Trigo",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-58.3734, -34.5958],
            [-58.3714, -34.5958],
            [-58.3714, -34.594],
            [-58.3734, -34.594],
            [-58.3734, -34.5958],
          ],
        ],
      },
    },
  },
  {
    id: 4,
    titulo: "Campo Oeste - Herbicida",
    estado: "completada",
    tipo: "Herbicida",
    fecha: "2024-01-12",
    cultivo: "Soja",
    costo: 18500,
    efectividad: 88,
    geometria: {
      type: "Feature",
      properties: {
        nombre: "Campo Oeste",
        cultivo: "Soja",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-58.389, -34.6158],
            [-58.387, -34.6158],
            [-58.387, -34.614],
            [-58.389, -34.614],
            [-58.389, -34.6158],
          ],
        ],
      },
    },
  },
  {
    id: 5,
    titulo: "Lote Central Irregular",
    estado: "cancelada",
    tipo: "Insecticida",
    fecha: "2024-01-22",
    cultivo: "Girasol",
    costo: 9500,
    efectividad: null,
    geometria: {
      type: "Feature",
      properties: {
        nombre: "Lote Central",
        cultivo: "Girasol",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-58.375, -34.608],
            [-58.373, -34.608],
            [-58.3725, -34.6065],
            [-58.374, -34.6055],
            [-58.3755, -34.6065],
            [-58.375, -34.608],
          ],
        ],
      },
    },
  },
];

const MapaFumigacionesGeoespacial = ({ onBack }) => {
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [fumigaciones, setFumigaciones] = useState([]);

  // Función para cargar y procesar datos
  const cargarDatos = useCallback(() => {
    const datosReales = JSON.parse(
      localStorage.getItem("fumigaciones") || "[]"
    );

    if (datosReales.length > 0) {
      // Convertir datos existentes a formato GeoJSON si no lo tienen
      const datosConGeometria = datosReales.map((fumigacion, index) => {
        if (fumigacion.geometria && fumigacion.geometria.geometry) {
          // Ya tiene geometría, calcular área si no la tiene
          const area = turf.area(fumigacion.geometria) / 10000; // Convertir a hectáreas
          return {
            ...fumigacion,
            hectareas: fumigacion.hectareas || Math.round(area * 100) / 100,
          };
        } else {
          // Crear geometría desde coordenadas puntuales o usar ejemplo
          const ejemploBase =
            FUMIGACIONES_GEOJSON[index % FUMIGACIONES_GEOJSON.length];
          const offsetLat = (Math.random() - 0.5) * 0.02;
          const offsetLng = (Math.random() - 0.5) * 0.02;

          const nuevaGeometria = {
            ...ejemploBase.geometria,
            geometry: {
              ...ejemploBase.geometria.geometry,
              coordinates: [
                [
                  ...ejemploBase.geometria.geometry.coordinates[0].map(
                    ([lng, lat]) => [lng + offsetLng, lat + offsetLat]
                  ),
                ],
              ],
            },
          };

          const area = turf.area(nuevaGeometria) / 10000;

          return {
            ...fumigacion,
            geometria: nuevaGeometria,
            hectareas: Math.round(area * 100) / 100,
          };
        }
      });

      setFumigaciones(datosConGeometria);
      // Guardar los datos actualizados
      localStorage.setItem("fumigaciones", JSON.stringify(datosConGeometria));
    } else {
      // Usar datos de ejemplo con geometrías
      const ejemplosConArea = FUMIGACIONES_GEOJSON.map((fumigacion) => ({
        ...fumigacion,
        hectareas:
          Math.round((turf.area(fumigacion.geometria) / 10000) * 100) / 100,
      }));
      setFumigaciones(ejemplosConArea);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Filtrar fumigaciones por estado
  const fumigacionesFiltradas = useMemo(() => {
    if (filtroEstado === "todos") {
      return fumigaciones;
    }
    return fumigaciones.filter((f) => f.estado === filtroEstado);
  }, [fumigaciones, filtroEstado]);

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    const completadas = fumigaciones.filter((f) => f.estado === "completada");
    const totalHectareas = fumigaciones.reduce(
      (sum, f) => sum + (f.hectareas || 0),
      0
    );
    const totalCosto = fumigaciones.reduce((sum, f) => sum + (f.costo || 0), 0);
    const promedioEfectividad =
      completadas.length > 0
        ? completadas.reduce((sum, f) => sum + (f.efectividad || 0), 0) /
          completadas.length
        : 0;

    return {
      totalCampos: fumigaciones.length,
      hectareasTratadas: Math.round(totalHectareas * 100) / 100,
      costoTotal: totalCosto,
      efectividadPromedio: Math.round(promedioEfectividad),
    };
  }, [fumigaciones]);

  const getPolygonColor = (estado) => {
    return ESTADO_COLORES[estado] || "#6c757d";
  };

  const getCentroid = (geometry) => {
    const centroide = turf.centroid(geometry);
    return [
      centroide.geometry.coordinates[1],
      centroide.geometry.coordinates[0],
    ];
  };

  const convertToLeafletCoordinates = (coordinates) => {
    return coordinates[0].map(([lng, lat]) => [lat, lng]);
  };

  return (
    <MapaContainer>
      <MapaHeader>
        <Title>
          <FaMapMarkerAlt />
          Mapa Geoespacial de Fumigaciones
        </Title>

        <ControlsContainer>
          <FilterButton
            active={filtroEstado === "todos"}
            onClick={() => setFiltroEstado("todos")}
          >
            <FaEye />
            Todos ({fumigaciones.length})
          </FilterButton>

          <FilterButton
            active={filtroEstado === "completada"}
            onClick={() => setFiltroEstado("completada")}
          >
            <FaCheckCircle />
            Completadas
          </FilterButton>

          <FilterButton
            active={filtroEstado === "pendiente"}
            onClick={() => setFiltroEstado("pendiente")}
          >
            <FaClock />
            Pendientes
          </FilterButton>

          <FilterButton
            active={filtroEstado === "en-proceso"}
            onClick={() => setFiltroEstado("en-proceso")}
          >
            <GiSpray />
            En Proceso
          </FilterButton>
        </ControlsContainer>
      </MapaHeader>

      <MapWrapper>
        <MapContainer
          center={[-34.6037, -58.3816]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <LayerGroup>
            {fumigacionesFiltradas.map((fumigacion) => {
              const color = getPolygonColor(fumigacion.estado);
              const centroid = getCentroid(fumigacion.geometria);
              const leafletCoords = convertToLeafletCoordinates(
                fumigacion.geometria.geometry.coordinates
              );

              return (
                <div key={fumigacion.id}>
                  {/* Polígono del campo */}
                  <Polygon
                    positions={leafletCoords}
                    color={color}
                    fillColor={color}
                    fillOpacity={0.3}
                    weight={3}
                  >
                    <Popup>
                      <div style={{ minWidth: "250px" }}>
                        <h3
                          style={{
                            color: "var(--primary-color)",
                            margin: "0 0 10px 0",
                          }}
                        >
                          {fumigacion.titulo ||
                            fumigacion.geometria.properties.nombre}
                        </h3>
                        <p>
                          <strong>Estado:</strong> {fumigacion.estado}
                        </p>
                        <p>
                          <strong>Tipo:</strong> {fumigacion.tipo}
                        </p>
                        <p>
                          <strong>Cultivo:</strong>{" "}
                          {fumigacion.cultivo ||
                            fumigacion.geometria.properties.cultivo}
                        </p>
                        <p>
                          <strong>Fecha:</strong> {fumigacion.fecha}
                        </p>
                        <p>
                          <strong>Área:</strong> {fumigacion.hectareas} ha
                        </p>
                        <p>
                          <strong>Costo:</strong> $
                          {fumigacion.costo?.toLocaleString()}
                        </p>
                        {fumigacion.efectividad && (
                          <p>
                            <strong>Efectividad:</strong>{" "}
                            {fumigacion.efectividad}%
                          </p>
                        )}
                        <div
                          style={{
                            marginTop: "10px",
                            padding: "5px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "3px",
                          }}
                        >
                          <small>
                            <FaCalculator /> Área calculada automáticamente con
                            Turf.js
                          </small>
                        </div>
                      </div>
                    </Popup>
                    <Tooltip permanent={false}>
                      {fumigacion.titulo ||
                        fumigacion.geometria.properties.nombre}{" "}
                      - {fumigacion.hectareas} ha
                    </Tooltip>
                  </Polygon>

                  {/* Marcador en el centroide */}
                  <Marker position={centroid}>
                    <Popup>
                      <div>
                        <h4>
                          {fumigacion.titulo ||
                            fumigacion.geometria.properties.nombre}
                        </h4>
                        <p>Centro del campo</p>
                      </div>
                    </Popup>
                  </Marker>
                </div>
              );
            })}
          </LayerGroup>
        </MapContainer>

        <LeyendaContainer>
          <LeyendaTitulo>
            <FaInfoCircle />
            Leyenda
          </LeyendaTitulo>

          <LeyendaItem>
            <ColorIndicator color={ESTADO_COLORES.completada} />
            Completadas
          </LeyendaItem>

          <LeyendaItem>
            <ColorIndicator color={ESTADO_COLORES.pendiente} />
            Pendientes
          </LeyendaItem>

          <LeyendaItem>
            <ColorIndicator color={ESTADO_COLORES["en-proceso"]} />
            En Proceso
          </LeyendaItem>

          <LeyendaItem>
            <ColorIndicator color={ESTADO_COLORES.cancelada} />
            Canceladas
          </LeyendaItem>

          <div
            style={{
              marginTop: "10px",
              padding: "5px",
              fontSize: "0.75rem",
              color: "#666",
            }}
          >
            <FaEdit /> Polígonos con áreas reales calculadas
          </div>
        </LeyendaContainer>
      </MapWrapper>

      <EstadisticasContainer>
        <EstadisticaCard>
          <EstadisticaValor>{estadisticas.totalCampos}</EstadisticaValor>
          <EstadisticaLabel>Total de Campos</EstadisticaLabel>
        </EstadisticaCard>

        <EstadisticaCard>
          <EstadisticaValor>{estadisticas.hectareasTratadas}</EstadisticaValor>
          <EstadisticaLabel>Hectáreas Tratadas</EstadisticaLabel>
        </EstadisticaCard>

        <EstadisticaCard>
          <EstadisticaValor>
            ${estadisticas.costoTotal.toLocaleString()}
          </EstadisticaValor>
          <EstadisticaLabel>Costo Total</EstadisticaLabel>
        </EstadisticaCard>

        <EstadisticaCard>
          <EstadisticaValor>
            {estadisticas.efectividadPromedio}%
          </EstadisticaValor>
          <EstadisticaLabel>Efectividad Promedio</EstadisticaLabel>
        </EstadisticaCard>
      </EstadisticasContainer>
    </MapaContainer>
  );
};

MapaFumigacionesGeoespacial.propTypes = {
  onBack: PropTypes.func,
};

export default MapaFumigacionesGeoespacial;
