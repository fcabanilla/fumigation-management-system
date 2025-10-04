import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLotes } from '../hooks/useApi';
import { FaMapMarkedAlt, FaPlus, FaEdit, FaEye } from 'react-icons/fa';
import { GiWheat } from 'react-icons/gi';
import * as turf from '@turf/turf';

// Styled Components
const SelectorContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SelectorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const SelectorTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ModeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ModeButton = styled.button`
  background: ${props =>
    props.active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props =>
    props.active ? props.theme.colors.textOnPrimary : props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.primary};
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${props =>
      props.active
        ? props.theme.colors.primary
        : `${props.theme.colors.primary}20`};
  }
`;

const LotesList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${props => props.theme.colors.borderLight};
  border-radius: 8px;
`;

const LoteItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props =>
    props.selected ? `${props.theme.colors.primary}15` : 'transparent'};

  &:hover {
    background: ${props =>
      props.selected
        ? `${props.theme.colors.primary}20`
        : props.theme.colors.surfaceHover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const LoteInfo = styled.div`
  flex: 1;
`;

const LoteName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.3rem;
`;

const LoteDetails = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const LoteDetail = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${props => props.theme.colors.textMuted};

  svg {
    font-size: 2rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

const SelectedLotePreview = styled.div`
  background: ${props => `${props.theme.colors.primary}10`};
  border: 1px solid ${props => `${props.theme.colors.primary}40`};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const PreviewTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PreviewStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
`;

const PreviewStat = styled.div`
  text-align: center;

  .value {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }

  .label {
    font-size: 0.8rem;
    color: ${props => props.theme.colors.textSecondary};
    margin-top: 0.2rem;
  }
`;

const LoteSelector = ({
  mode,
  onModeChange,
  selectedLoteId,
  onLoteSelect,
  onViewLote,
  onNewLote,
}) => {
  const { theme } = useTheme();
  const { loading, getLotesConGeometria, getLoteById } = useLotes();

  const lotesDisponibles = getLotesConGeometria();
  const selectedLote = selectedLoteId ? getLoteById(selectedLoteId) : null;

  // Calcular estadísticas del lote seleccionado
  const getEstadisticasLote = lote => {
    if (!lote?.geometria?.geometry) {
      return { area: 0, perimetro: 0, vertices: 0 };
    }

    try {
      const area = turf.area(lote.geometria) / 10000; // Hectáreas
      const perimetro = turf.length(lote.geometria, { units: 'kilometers' });
      const vertices = lote.geometria.geometry.coordinates[0].length - 1;

      return {
        area: Math.round(area * 100) / 100,
        perimetro: Math.round(perimetro * 100) / 100,
        vertices,
      };
    } catch {
      return { area: 0, perimetro: 0, vertices: 0 };
    }
  };

  const handleLoteClick = lote => {
    if (mode === 'existing') {
      onLoteSelect(lote);
    }
  };

  if (loading) {
    return (
      <SelectorContainer theme={theme}>
        <SelectorHeader theme={theme}>
          <FaMapMarkedAlt />
          <SelectorTitle>Cargando lotes...</SelectorTitle>
        </SelectorHeader>
      </SelectorContainer>
    );
  }

  return (
    <SelectorContainer theme={theme}>
      <SelectorHeader theme={theme}>
        <FaMapMarkedAlt />
        <SelectorTitle>Geometría del Campo</SelectorTitle>
      </SelectorHeader>

      <ModeSelector>
        <ModeButton
          active={mode === 'new'}
          onClick={() => onModeChange('new')}
          theme={theme}
        >
          <FaPlus />
          Dibujar Nuevo Campo
        </ModeButton>

        <ModeButton
          active={mode === 'existing'}
          onClick={() => onModeChange('existing')}
          theme={theme}
        >
          <GiWheat />
          Usar Lote Existente
        </ModeButton>
      </ModeSelector>

      {mode === 'existing' && (
        <>
          {lotesDisponibles.length === 0 ? (
            <EmptyState theme={theme}>
              <GiWheat />
              <h4>No hay lotes disponibles</h4>
              <p>Crea primero algunos lotes en la sección "Gestión de Lotes"</p>
            </EmptyState>
          ) : (
            <LotesList theme={theme}>
              {lotesDisponibles.map(lote => {
                const estadisticas = getEstadisticasLote(lote);
                const isSelected = selectedLoteId === lote.id;

                return (
                  <LoteItem
                    key={lote.id}
                    selected={isSelected}
                    onClick={() => handleLoteClick(lote)}
                    theme={theme}
                  >
                    <LoteInfo>
                      <LoteName theme={theme}>{lote.nombre}</LoteName>
                      <LoteDetails theme={theme}>
                        <LoteDetail>
                          <GiWheat />
                          {lote.cultivo}
                        </LoteDetail>
                        <LoteDetail>
                          <FaMapMarkedAlt />
                          {estadisticas.area} ha
                        </LoteDetail>
                        <LoteDetail>👤 {lote.propietario}</LoteDetail>
                      </LoteDetails>
                    </LoteInfo>

                    <ActionButtons>
                      <ActionButton
                        onClick={e => {
                          e.stopPropagation();
                          onViewLote(lote);
                        }}
                        theme={theme}
                        title="Ver detalles del lote"
                      >
                        <FaEye />
                      </ActionButton>
                    </ActionButtons>
                  </LoteItem>
                );
              })}
            </LotesList>
          )}

          {selectedLote && (
            <SelectedLotePreview theme={theme}>
              <PreviewTitle theme={theme}>
                <GiWheat />
                Lote Seleccionado: {selectedLote.nombre}
              </PreviewTitle>
              <PreviewStats>
                <PreviewStat theme={theme}>
                  <div className="value">
                    {getEstadisticasLote(selectedLote).area}
                  </div>
                  <div className="label">Hectáreas</div>
                </PreviewStat>
                <PreviewStat theme={theme}>
                  <div className="value">{selectedLote.cultivo}</div>
                  <div className="label">Cultivo</div>
                </PreviewStat>
                <PreviewStat theme={theme}>
                  <div className="value">{selectedLote.propietario}</div>
                  <div className="label">Propietario</div>
                </PreviewStat>
                <PreviewStat theme={theme}>
                  <div className="value">
                    {getEstadisticasLote(selectedLote).perimetro} km
                  </div>
                  <div className="label">Perímetro</div>
                </PreviewStat>
              </PreviewStats>
            </SelectedLotePreview>
          )}
        </>
      )}

      {mode === 'new' && onNewLote && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <p
            style={{ color: theme.colors.textSecondary, marginBottom: '1rem' }}
          >
            Usa las herramientas de dibujo en el mapa para crear un nuevo campo
          </p>
          <ActionButton
            onClick={onNewLote}
            theme={theme}
            style={{
              background: theme.colors.primary,
              color: theme.colors.textOnPrimary,
              padding: '0.7rem 1.2rem',
              borderRadius: '8px',
            }}
          >
            <FaEdit />
            Ir a Gestión de Lotes
          </ActionButton>
        </div>
      )}
    </SelectorContainer>
  );
};

LoteSelector.propTypes = {
  mode: PropTypes.oneOf(['new', 'existing']).isRequired,
  onModeChange: PropTypes.func.isRequired,
  selectedLoteId: PropTypes.number,
  onLoteSelect: PropTypes.func.isRequired,
  onViewLote: PropTypes.func,
  onNewLote: PropTypes.func,
};

export default LoteSelector;
