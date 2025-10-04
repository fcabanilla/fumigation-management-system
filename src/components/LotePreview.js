import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { MapViewer } from './MapComponent';
import * as turf from '@turf/turf';
import { FaMapMarkedAlt, FaCalculator, FaUser, FaExpand } from 'react-icons/fa';
import { GiWheat } from 'react-icons/gi';

// Styled Components
const PreviewContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: ${props => (props.compact ? '1rem' : '1.5rem')};
  margin: ${props => (props.compact ? '0.5rem 0' : '1rem 0')};
  box-shadow: ${props => props.theme.colors.shadow};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => (props.compact ? '0.75rem' : '1rem')};
`;

const LoteTitle = styled.h4`
  color: ${props => props.theme.colors.text};
  margin: 0;
  font-size: ${props => (props.compact ? '1rem' : '1.2rem')};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoteInfo = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const ExpandButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  padding: 0.5rem;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: ${props =>
    props.compact ? '1fr' : props.showMap ? '1fr 1fr' : '1fr'};
  gap: 1.5rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const InfoIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  width: 20px;
  text-align: center;
`;

const InfoText = styled.span`
  color: ${props => props.theme.colors.text};
`;

const InfoLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: ${props => props.theme.colors.backgroundAccent};
  border-radius: 8px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${props => (props.compact ? '1rem' : '1.2rem')};
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.2rem;
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MapSection = styled.div`
  border-radius: 8px;
  overflow: hidden;
  height: ${props => props.height || '200px'};
  min-height: ${props => props.height || '200px'};
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  background: #f0f0f0;

  .leaflet-container {
    height: 100% !important;
    width: 100% !important;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.backgroundAccent};
  border-radius: 8px;
  border: 2px dashed ${props => props.theme.colors.border};

  svg {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }
`;

const LotePreview = ({
  lote,
  compact = false,
  showMap = true,
  mapHeight = '200px',
  onExpand = null,
  showExpandButton = false,
}) => {
  const { theme } = useTheme();

  // Calcular estadísticas de la geometría
  const estadisticas = React.useMemo(() => {
    if (!lote || !lote.geometria || !lote.geometria.geometry) {
      return {
        area: 0,
        perimetro: 0,
        vertices: 0,
      };
    }

    const area = turf.area(lote.geometria) / 10000; // Convertir a hectáreas
    const perimetro = turf.length(lote.geometria, { units: 'kilometers' });
    const vertices = lote.geometria.geometry.coordinates[0].length - 1;

    return {
      area: Math.round(area * 100) / 100,
      perimetro: Math.round(perimetro * 100) / 100,
      vertices,
    };
  }, [lote]);

  if (!lote) {
    return (
      <PreviewContainer theme={theme} compact={compact}>
        <EmptyState theme={theme}>
          <GiWheat />
          <div>Sin información de lote</div>
        </EmptyState>
      </PreviewContainer>
    );
  }

  return (
    <PreviewContainer theme={theme} compact={compact}>
      <PreviewHeader compact={compact}>
        <div>
          <LoteTitle theme={theme} compact={compact}>
            <GiWheat />
            {lote.nombre}
          </LoteTitle>
          <LoteInfo theme={theme}>
            {lote.cultivo} • {lote.propietario}
          </LoteInfo>
        </div>

        {showExpandButton && onExpand && (
          <ExpandButton theme={theme} onClick={() => onExpand(lote)}>
            <FaExpand />
            {!compact && 'Ver completo'}
          </ExpandButton>
        )}
      </PreviewHeader>

      <ContentGrid compact={compact} showMap={showMap && !compact}>
        <InfoSection>
          <InfoRow>
            <InfoIcon theme={theme}>
              <FaCalculator />
            </InfoIcon>
            <InfoText theme={theme}>{lote.hectareas} ha declaradas</InfoText>
          </InfoRow>

          <InfoRow>
            <InfoIcon theme={theme}>
              <FaUser />
            </InfoIcon>
            <InfoText theme={theme}>{lote.propietario}</InfoText>
          </InfoRow>

          <InfoRow>
            <InfoIcon theme={theme}>
              <FaMapMarkedAlt />
            </InfoIcon>
            <InfoText theme={theme}>
              {lote.geometria ? '✅ Geometría definida' : '❌ Sin geometría'}
            </InfoText>
          </InfoRow>

          {lote.geometria && !compact && (
            <StatsGrid theme={theme}>
              <StatItem>
                <StatValue theme={theme} compact={compact}>
                  {estadisticas.area}
                </StatValue>
                <StatLabel theme={theme}>ha calc.</StatLabel>
              </StatItem>

              <StatItem>
                <StatValue theme={theme} compact={compact}>
                  {estadisticas.perimetro}
                </StatValue>
                <StatLabel theme={theme}>km per.</StatLabel>
              </StatItem>

              <StatItem>
                <StatValue theme={theme} compact={compact}>
                  {estadisticas.vertices}
                </StatValue>
                <StatLabel theme={theme}>vértices</StatLabel>
              </StatItem>
            </StatsGrid>
          )}
        </InfoSection>

        {showMap && !compact && lote.geometria && (
          <MapSection theme={theme} height={mapHeight}>
            <MapViewer
              geometry={lote.geometria}
              height={mapHeight}
              showControls={false}
            />
          </MapSection>
        )}
      </ContentGrid>

      {showMap && !compact && !lote.geometria && (
        <EmptyState theme={theme}>
          <FaMapMarkedAlt />
          <div>Sin ubicación geográfica</div>
          <InfoLabel theme={theme}>
            Edita el lote para agregar su geometría
          </InfoLabel>
        </EmptyState>
      )}
    </PreviewContainer>
  );
};

LotePreview.propTypes = {
  lote: PropTypes.shape({
    id: PropTypes.string,
    nombre: PropTypes.string.isRequired,
    cultivo: PropTypes.string.isRequired,
    propietario: PropTypes.string.isRequired,
    hectareas: PropTypes.number.isRequired,
    geometria: PropTypes.object,
  }),
  compact: PropTypes.bool,
  showMap: PropTypes.bool,
  mapHeight: PropTypes.string,
  onExpand: PropTypes.func,
  showExpandButton: PropTypes.bool,
};

export default LotePreview;
