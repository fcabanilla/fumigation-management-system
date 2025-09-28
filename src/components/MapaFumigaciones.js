import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayerGroup,
  Circle,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaMapMarkerAlt,
  FaEye,
  FaInfoCircle,
  FaCheckCircle,
  FaClock,
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
  border-radius: 50%;
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

// Iconos personalizados para marcadores
const createCustomIcon = (color, IconComponent) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
      ">
        <i class="fa fa-spray-can"></i>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Colores por estado
const ESTADO_COLORES = {
  completada: "#28a745",
  pendiente: "#ffc107",
  "en-proceso": "#17a2b8",
  cancelada: "#dc3545",
};

// Datos de ejemplo de campos y fumigaciones con coordenadas
const FUMIGACIONES_EJEMPLO = [
  {
    id: 1,
    campo: "Campo Norte",
    coordenadas: [-34.6037, -58.3816], // Buenos Aires como ejemplo
    estado: "completada",
    tipo: "Herbicida",
    fecha: "2024-01-15",
    hectareas: 25,
    costo: 15000,
    efectividad: 92,
  },
  {
    id: 2,
    campo: "Lote Sur",
    coordenadas: [-34.6118, -58.396],
    estado: "pendiente",
    tipo: "Insecticida",
    fecha: "2024-01-20",
    hectareas: 18,
    costo: 12000,
    efectividad: null,
  },
  {
    id: 3,
    campo: "Parcela Este",
    coordenadas: [-34.5958, -58.3734],
    estado: "en-proceso",
    tipo: "Fungicida",
    fecha: "2024-01-18",
    hectareas: 32,
    costo: 22000,
    efectividad: null,
  },
  {
    id: 4,
    campo: "Campo Oeste",
    coordenadas: [-34.6158, -58.389],
    estado: "completada",
    tipo: "Herbicida",
    fecha: "2024-01-12",
    hectareas: 28,
    costo: 18500,
    efectividad: 88,
  },
  {
    id: 5,
    campo: "Lote Central",
    coordenadas: [-34.608, -58.375],
    estado: "cancelada",
    tipo: "Insecticida",
    fecha: "2024-01-22",
    hectareas: 15,
    costo: 9500,
    efectividad: null,
  },
];

const MapaFumigaciones = ({ onBack }) => {
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [fumigaciones, setFumigaciones] = useState([]);

  // Función para cargar datos
  const cargarDatos = useCallback(() => {
    const datosReales = JSON.parse(
      localStorage.getItem("fumigaciones") || "[]"
    );

    if (datosReales.length > 0) {
      const datosConCoordenadas = datosReales.map((fumigacion) => ({
        ...fumigacion,
        coordenadas: fumigacion.coordenadas || [
          -34.6037 + (Math.random() - 0.5) * 0.1,
          -58.3816 + (Math.random() - 0.5) * 0.1,
        ],
        hectareas: fumigacion.hectareas || Math.floor(Math.random() * 40) + 10,
        costo: fumigacion.costo || Math.floor(Math.random() * 30000) + 5000,
        efectividad:
          fumigacion.estado === "completada"
            ? fumigacion.efectividad || Math.floor(Math.random() * 20) + 80
            : null,
      }));
      setFumigaciones(datosConCoordenadas);

      // Solo guardar si se agregaron coordenadas nuevas
      if (
        datosConCoordenadas.some(
          (f) => !localStorage.getItem("fumigaciones").includes('"coordenadas"')
        )
      ) {
        localStorage.setItem(
          "fumigaciones",
          JSON.stringify(datosConCoordenadas)
        );
      }
    } else {
      setFumigaciones(FUMIGACIONES_EJEMPLO);
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
      hectareasTratadas: totalHectareas,
      costoTotal: totalCosto,
      efectividadPromedio: Math.round(promedioEfectividad),
    };
  }, [fumigaciones]);

  const getMarkerColor = (estado) => {
    return ESTADO_COLORES[estado] || "#6c757d";
  };

  const shouldShowMarker = () => {
    return true; // Por ahora mostrar todos los marcadores
  };

  return (
    <MapaContainer>
      <MapaHeader>
        <Title>
          <FaMapMarkerAlt />
          Mapa de Fumigaciones
        </Title>

        <ControlsContainer>
          <FilterButton
            active={filtroEstado === "todos"}
            onClick={() => setFiltroEstado("todos")}
          >
            <FaEye />
            Todos
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
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <LayerGroup>
            {fumigacionesFiltradas.map((fumigacion) => {
              if (!shouldShowMarker(fumigacion.estado)) {
                return null;
              }

              return (
                <div key={fumigacion.id}>
                  <Marker
                    position={fumigacion.coordenadas}
                    icon={createCustomIcon(getMarkerColor(fumigacion.estado))}
                  >
                    <Popup>
                      <div style={{ minWidth: "200px" }}>
                        <h3
                          style={{
                            color: "var(--primary-color)",
                            margin: "0 0 10px 0",
                          }}
                        >
                          {fumigacion.campo}
                        </h3>
                        <p>
                          <strong>Estado:</strong> {fumigacion.estado}
                        </p>
                        <p>
                          <strong>Tipo:</strong> {fumigacion.tipo}
                        </p>
                        <p>
                          <strong>Fecha:</strong> {fumigacion.fecha}
                        </p>
                        <p>
                          <strong>Hectáreas:</strong> {fumigacion.hectareas} ha
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
                      </div>
                    </Popup>
                    <Tooltip permanent={false}>{fumigacion.campo}</Tooltip>
                  </Marker>

                  {/* Círculo para mostrar área aproximada */}
                  <Circle
                    center={fumigacion.coordenadas}
                    radius={Math.sqrt(fumigacion.hectareas || 20) * 50}
                    fillColor={getMarkerColor(fumigacion.estado)}
                    fillOpacity={0.2}
                    color={getMarkerColor(fumigacion.estado)}
                    weight={2}
                  />
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

MapaFumigaciones.propTypes = {
  onBack: PropTypes.func,
};

export default MapaFumigaciones;
