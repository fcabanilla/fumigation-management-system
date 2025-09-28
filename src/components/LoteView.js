import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTheme } from "../contexts/ThemeContext";
import MapaViewer from "./MapaViewer";
import * as turf from "@turf/turf";
import {
  FaEdit,
  FaTrash,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaUser,
  FaCalculator,
} from "react-icons/fa";
import { GiWheat } from "react-icons/gi";

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TitleSection = styled.div`
  flex: 1;
  min-width: 300px;
`;

const Title = styled.h1`
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 2rem;
`;

const Subtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  &.danger:hover {
    background: #dc3545;
    border-color: #dc3545;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoSection = styled.div`
  background: ${(props) => props.theme?.colors?.surface || "white"};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${(props) => props.theme?.colors?.border || "#e0e0e0"};
  box-shadow: ${(props) =>
    props.theme?.colors?.shadow || "0 2px 8px rgba(0, 0, 0, 0.05)"};
`;

const SectionTitle = styled.h3`
  color: #4a7c59;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const InfoIcon = styled.div`
  color: #4a7c59;
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.2rem;
`;

const InfoValue = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 1rem;
`;

const StatsSection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  background: ${(props) => props.theme?.colors?.surface || "white"};
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme?.colors?.border || "#e0e0e0"};
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme?.colors?.primary || "#4a7c59"};
  margin-bottom: 0.2rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${(props) => props.theme?.colors?.textSecondary || "#666"};
`;

const MapSection = styled.div`
  grid-column: 1 / -1;
  background: ${(props) => props.theme?.colors?.surface || "white"};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${(props) => props.theme?.colors?.border || "#e0e0e0"};
  box-shadow: ${(props) =>
    props.theme?.colors?.shadow || "0 2px 8px rgba(0, 0, 0, 0.05)"};
`;

const EmptyGeometry = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #ddd;

  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

const LoteView = ({ lote, onEdit, onDelete }) => {
  const { theme } = useTheme();

  // Calcular estadísticas de la geometría (debe estar antes de cualquier early return)
  const estadisticas = React.useMemo(() => {
    if (!lote || !lote.geometria || !lote.geometria.geometry) {
      return {
        area: 0,
        perimetro: 0,
        vertices: 0,
      };
    }

    const area = turf.area(lote.geometria) / 10000; // Convertir a hectáreas
    const perimetro = turf.length(lote.geometria, { units: "kilometers" });
    const vertices = lote.geometria.geometry.coordinates[0].length - 1;

    return {
      area: Math.round(area * 100) / 100,
      perimetro: Math.round(perimetro * 100) / 100,
      vertices,
    };
  }, [lote]);

  if (!lote) {
    return (
      <Container>
        <EmptyGeometry>
          <GiWheat />
          <h3>Lote no encontrado</h3>
          <p>El lote que intentas ver no existe o ha sido eliminado.</p>
        </EmptyGeometry>
      </Container>
    );
  }

  const handleDelete = () => {
    onDelete(lote.id);
  };

  return (
    <Container>
      {/* Header */}
      <HeaderSection>
        <HeaderContent>
          <TitleSection>
            <Title>
              <GiWheat />
              {lote.nombre}
            </Title>
            <Subtitle>{lote.descripcion}</Subtitle>
          </TitleSection>

          <ActionButtons>
            <ActionButton onClick={onEdit}>
              <FaEdit />
              Editar Lote
            </ActionButton>

            <ActionButton className="danger" onClick={handleDelete}>
              <FaTrash />
              Eliminar
            </ActionButton>
          </ActionButtons>
        </HeaderContent>
      </HeaderSection>

      <ContentGrid>
        {/* Información General */}
        <InfoSection theme={theme}>
          <SectionTitle>
            <GiWheat />
            Información General
          </SectionTitle>

          <InfoGrid>
            <InfoItem>
              <InfoIcon>
                <GiWheat />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Cultivo Principal</InfoLabel>
                <InfoValue>{lote.cultivo}</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FaUser />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Propietario</InfoLabel>
                <InfoValue>{lote.propietario}</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FaCalculator />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Hectáreas Declaradas</InfoLabel>
                <InfoValue>{lote.hectareas} ha</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FaCalendarAlt />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Fecha de Creación</InfoLabel>
                <InfoValue>
                  {new Date(lote.fechaCreacion).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </InfoValue>
              </InfoContent>
            </InfoItem>
          </InfoGrid>
        </InfoSection>

        {/* Información Geoespacial */}
        <InfoSection theme={theme}>
          <SectionTitle>
            <FaMapMarkedAlt />
            Información Geoespacial
          </SectionTitle>

          <InfoGrid>
            <InfoItem>
              <InfoIcon>
                <FaMapMarkedAlt />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Estado de Geometría</InfoLabel>
                <InfoValue>
                  {lote.geometria ? "✅ Definida" : "❌ Sin definir"}
                </InfoValue>
              </InfoContent>
            </InfoItem>
          </InfoGrid>

          {lote.geometria && (
            <StatsSection>
              <StatsGrid>
                <StatItem theme={theme}>
                  <StatValue theme={theme}>{estadisticas.area}</StatValue>
                  <StatLabel theme={theme}>Hectáreas Calculadas</StatLabel>
                </StatItem>

                <StatItem theme={theme}>
                  <StatValue theme={theme}>{estadisticas.perimetro}</StatValue>
                  <StatLabel theme={theme}>Perímetro (km)</StatLabel>
                </StatItem>

                <StatItem theme={theme}>
                  <StatValue theme={theme}>{estadisticas.vertices}</StatValue>
                  <StatLabel theme={theme}>Vértices</StatLabel>
                </StatItem>

                <StatItem theme={theme}>
                  <StatValue theme={theme}>
                    {Math.abs(lote.hectareas - estadisticas.area).toFixed(2)}
                  </StatValue>
                  <StatLabel theme={theme}>Diferencia (ha)</StatLabel>
                </StatItem>
              </StatsGrid>
            </StatsSection>
          )}
        </InfoSection>
      </ContentGrid>

      {/* Mapa */}
      <MapSection theme={theme}>
        <SectionTitle>
          <FaMapMarkedAlt />
          Visualización del Lote
        </SectionTitle>

        {lote.geometria ? (
          <MapaViewer geometry={lote.geometria} height="400px" />
        ) : (
          <EmptyGeometry>
            <FaMapMarkedAlt />
            <h3>Sin Geometría Definida</h3>
            <p>Este lote no tiene una geometría definida en el mapa.</p>
            <p>
              Haz click en "Editar Lote" para agregar la ubicación geográfica.
            </p>
          </EmptyGeometry>
        )}
      </MapSection>
    </Container>
  );
};

LoteView.propTypes = {
  lote: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default LoteView;
