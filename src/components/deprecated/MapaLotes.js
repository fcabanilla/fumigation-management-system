import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
} from "react-leaflet";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import {
  FaFilter,
  FaEye,
  FaCalculator,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { GiWheat } from "react-icons/gi";

// Styled Components
const Container = styled.div`
  padding: 2rem;
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
`;

const FilterSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #4a7c59;
    box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.2);
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: auto;
`;

const StatItem = styled.div`
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const MapWrapper = styled.div`
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  
  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`;

const PopupContent = styled.div`
  min-width: 250px;
`;

const PopupTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #4a7c59;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const PopupInfo = styled.div`
  margin-bottom: 0.5rem;
`;

const PopupLabel = styled.span`
  font-weight: 600;
  color: #333;
`;

const PopupValue = styled.span`
  color: #666;
`;

const PopupStats = styled.div`
  background: #f8f9fa;
  border-radius: 6px;
  padding: 0.8rem;
  margin: 0.5rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const PopupStatItem = styled.div`
  text-align: center;
`;

const PopupStatValue = styled.div`
  font-weight: bold;
  color: #4a7c59;
`;

const PopupStatLabel = styled.div`
  font-size: 0.7rem;
  color: #666;
`;

const ViewButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  width: 100%;
  justify-content: center;

  &:hover {
    background: #0056b3;
  }
`;

// Colores para diferentes cultivos
const COLORES_CULTIVOS = {
  'Soja': '#28a745',
  'Maíz': '#ffc107',
  'Trigo': '#fd7e14',
  'Girasol': '#e83e8c',
  'Sorgo': '#6f42c1',
  'Avena': '#20c997',
  'Cebada': '#6c757d',
  'Otro': '#17a2b8',
};

const MapaLotes = ({ lotes, onSelectLote }) => {
  const [filterCultivo, setFilterCultivo] = useState("");
  const [filterPropietario, setFilterPropietario] = useState("");

  // Filtrar lotes
  const lotesFiltrados = lotes.filter(lote => {
    const matchesCultivo = !filterCultivo || lote.cultivo === filterCultivo;
    const matchesPropietario = !filterPropietario || lote.propietario === filterPropietario;
    return matchesCultivo && matchesPropietario && lote.geometria;
  });

  // Calcular estadísticas
  const stats = React.useMemo(() => {
    const totalLotes = lotesFiltrados.length;
    const totalHectareas = lotesFiltrados.reduce((sum, lote) => {
      if (lote.geometria) {
        try {
          return sum + (turf.area(lote.geometria) / 10000);
        } catch {
          return sum + (lote.hectareas || 0);
        }
      }
      return sum + (lote.hectareas || 0);
    }, 0);

    return {
      totalLotes,
      totalHectareas: Math.round(totalHectareas * 10) / 10,
    };
  }, [lotesFiltrados]);

  // Obtener opciones únicas para filtros
  const cultivosDisponibles = [...new Set(lotes.map(lote => lote.cultivo))].filter(Boolean);
  const propietariosDisponibles = [...new Set(lotes.map(lote => lote.propietario))].filter(Boolean);

  // Calcular centro del mapa basado en los lotes
  const mapCenter = React.useMemo(() => {
    if (lotesFiltrados.length === 0) {
      return [-31.87, -60.01]; // Viale, Entre Ríos por defecto
    }

    const bounds = lotesFiltrados.reduce((acc, lote) => {
      if (lote.geometria && lote.geometria.geometry) {
        const coords = lote.geometria.geometry.coordinates[0];
        coords.forEach(([lng, lat]) => {
          if (!acc.minLat || lat < acc.minLat) {
            acc.minLat = lat;
          }
          if (!acc.maxLat || lat > acc.maxLat) {
            acc.maxLat = lat;
          }
          if (!acc.minLng || lng < acc.minLng) {
            acc.minLng = lng;
          }
          if (!acc.maxLng || lng > acc.maxLng) {
            acc.maxLng = lng;
          }
        });
      }
      return acc;
    }, {});

    return [
      (bounds.minLat + bounds.maxLat) / 2,
      (bounds.minLng + bounds.maxLng) / 2,
    ];
  }, [lotesFiltrados]);

  const convertToLeafletCoordinates = (coordinates) => {
    return coordinates[0].map(([lng, lat]) => [lat, lng]);
  };

  const calcularAreaLote = (lote) => {
    if (!lote.geometria) {
      return lote.hectareas || 0;
    }
    try {
      return Math.round((turf.area(lote.geometria) / 10000) * 100) / 100;
    } catch {
      return lote.hectareas || 0;
    }
  };

  const calcularPerimetroLote = (lote) => {
    if (!lote.geometria) {
      return 0;
    }
    try {
      return Math.round(turf.length(lote.geometria, { units: "kilometers" }) * 100) / 100;
    } catch {
      return 0;
    }
  };

  return (
    <Container>
      {/* Filtros y estadísticas */}
      <FilterSection>
        <FaFilter />
        
        <FilterSelect
          value={filterCultivo}
          onChange={(e) => setFilterCultivo(e.target.value)}
        >
          <option value="">Todos los cultivos</option>
          {cultivosDisponibles.map(cultivo => (
            <option key={cultivo} value={cultivo}>{cultivo}</option>
          ))}
        </FilterSelect>

        <FilterSelect
          value={filterPropietario}
          onChange={(e) => setFilterPropietario(e.target.value)}
        >
          <option value="">Todos los propietarios</option>
          {propietariosDisponibles.map(propietario => (
            <option key={propietario} value={propietario}>{propietario}</option>
          ))}
        </FilterSelect>

        <StatsBar>
          <StatItem>
            <FaMapMarkedAlt /> {stats.totalLotes} lotes
          </StatItem>
          <StatItem>
            <FaCalculator /> {stats.totalHectareas} ha
          </StatItem>
        </StatsBar>
      </FilterSection>

      {/* Mapa */}
      <MapWrapper>
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {lotesFiltrados.map(lote => (
            lote.geometria && lote.geometria.geometry && (
              <Polygon
                key={lote.id}
                positions={convertToLeafletCoordinates(lote.geometria.geometry.coordinates)}
                color={COLORES_CULTIVOS[lote.cultivo] || COLORES_CULTIVOS['Otro']}
                fillColor={COLORES_CULTIVOS[lote.cultivo] || COLORES_CULTIVOS['Otro']}
                fillOpacity={0.4}
                weight={3}
              >
                <Popup>
                  <PopupContent>
                    <PopupTitle>
                      <GiWheat />
                      {lote.nombre}
                    </PopupTitle>
                    
                    <PopupInfo>
                      <PopupLabel>Cultivo:</PopupLabel> <PopupValue>{lote.cultivo}</PopupValue>
                    </PopupInfo>
                    
                    <PopupInfo>
                      <PopupLabel>Propietario:</PopupLabel> <PopupValue>{lote.propietario}</PopupValue>
                    </PopupInfo>

                    {lote.descripcion && (
                      <PopupInfo>
                        <PopupLabel>Descripción:</PopupLabel> <PopupValue>{lote.descripcion}</PopupValue>
                      </PopupInfo>
                    )}

                    <PopupStats>
                      <PopupStatItem>
                        <PopupStatValue>{calcularAreaLote(lote)} ha</PopupStatValue>
                        <PopupStatLabel>Área</PopupStatLabel>
                      </PopupStatItem>
                      
                      <PopupStatItem>
                        <PopupStatValue>{calcularPerimetroLote(lote)} km</PopupStatValue>
                        <PopupStatLabel>Perímetro</PopupStatLabel>
                      </PopupStatItem>
                    </PopupStats>

                    <ViewButton onClick={() => onSelectLote(lote)}>
                      <FaEye />
                      Ver Detalles
                    </ViewButton>
                  </PopupContent>
                </Popup>
              </Polygon>
            )
          ))}
        </MapContainer>
      </MapWrapper>
    </Container>
  );
};

MapaLotes.propTypes = {
  lotes: PropTypes.array.isRequired,
  onSelectLote: PropTypes.func.isRequired,
};

export default MapaLotes;