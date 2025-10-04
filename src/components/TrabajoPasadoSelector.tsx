// ==================== SELECTOR DE TRABAJOS PASADOS ====================

/**
 * Componente para explorar, buscar y cargar trabajos de fumigación anteriores
 * Permite reutilizar configuraciones exitosas como plantillas para nuevos trabajos
 */

import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  FaSearch,
  FaFilter,
  FaHistory,
  FaCopy,
  FaEye,
  FaStar,
  FaTimes,
  FaSort,
} from 'react-icons/fa';
import {
  TrabajoPasado,
  PlantillaTrabajo,
  TRABAJOS_PASADOS_MOCK,
  PLANTILLAS_TRABAJO,
  FumigacionValidator,
} from '../utils/FumigacionValidator';
import { Fumigacion } from './FumigacionesList';

// ==================== TYPE FIXES ====================

// Fix para react-icons
const SearchIcon = FaSearch as React.ComponentType<{ className?: string }>;
const HistoryIcon = FaHistory as React.ComponentType<{ size?: number }>;
const CopyIcon = FaCopy as React.ComponentType<{ size?: number }>;
const StarIcon = FaStar as React.ComponentType<{ size?: number }>;
const TimesIcon = FaTimes as React.ComponentType<{ size?: number }>;

// ==================== INTERFACES ====================

interface TrabajoPasadoSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrabajo: (trabajo: TrabajoPasado) => void;
  onSelectPlantilla: (plantilla: PlantillaTrabajo) => void;
  currentData?: Partial<Fumigacion>;
}

interface FiltrosBusqueda {
  busqueda: string;
  tipoTratamiento: string;
  producto: string;
  fechaDesde: string;
  fechaHasta: string;
  eficaciaMinima: number;
  ordenarPor: 'fecha' | 'eficacia' | 'costo' | 'hectareas';
  ordenDesc: boolean;
}

// ==================== STYLED COMPONENTS ====================

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #4a7c59, #2d5016);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  background: #f8f9fa;
`;

const Tab = styled.button<{ active: boolean }>`
  background: ${props => (props.active ? 'white' : 'transparent')};
  border: none;
  border-bottom: 3px solid
    ${props => (props.active ? '#4a7c59' : 'transparent')};
  padding: 15px 25px;
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  color: ${props => (props.active ? '#4a7c59' : '#666')};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => (props.active ? 'white' : '#f0f0f0')};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const FiltrosContainer = styled.div`
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #333;
  }
`;

const SearchInput = styled.div`
  position: relative;

  input {
    width: 100%;
    padding: 10px 40px 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: #4a7c59;
      box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.2);
    }
  }

  .search-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #4a7c59;
    box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.2);
  }
`;

const RangeInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #4a7c59;
    box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.2);
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h3 {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
  }

  .results-count {
    color: #666;
    font-size: 0.9rem;
  }
`;

const TrabajoCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: #4a7c59;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const TrabajoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;

  h4 {
    margin: 0;
    color: #2d5016;
    font-size: 1.1rem;
  }

  .fecha {
    color: #666;
    font-size: 0.9rem;
  }
`;

const TrabajoDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
`;

const DetailItem = styled.div`
  .label {
    font-size: 0.8rem;
    color: #666;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 0.95rem;
    color: #333;
    font-weight: 500;
    margin-top: 2px;
  }
`;

const EfectividadBadge = styled.span<{ eficacia: number }>`
  background: ${props =>
    props.eficacia >= 90
      ? '#28a745'
      : props.eficacia >= 80
        ? '#ffc107'
        : props.eficacia >= 70
          ? '#fd7e14'
          : '#dc3545'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const EtiquetasContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0;
`;

const Etiqueta = styled.span`
  background: #e9ecef;
  color: #495057;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => (props.variant === 'primary' ? '#4a7c59' : '#6c757d')};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.variant === 'primary' ? '#2d5016' : '#5a6268'};
  }
`;

const SugerenciasContainer = styled.div`
  background: #e7f3ff;
  border: 1px solid #bee5eb;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;

  h4 {
    margin: 0 0 10px 0;
    color: #004085;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const PlantillaDescription = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;

  .icon {
    font-size: 3rem;
    color: #ccc;
    margin-bottom: 15px;
  }

  h3 {
    color: #333;
    margin-bottom: 10px;
  }
`;

// ==================== COMPONENT ====================

const TrabajoPasadoSelector: React.FC<TrabajoPasadoSelectorProps> = ({
  isOpen,
  onClose,
  onSelectTrabajo,
  onSelectPlantilla,
  currentData = {},
}) => {
  const [activeTab, setActiveTab] = useState<'trabajos' | 'plantillas'>(
    'trabajos'
  );
  const [filtros, setFiltros] = useState<FiltrosBusqueda>({
    busqueda: '',
    tipoTratamiento: '',
    producto: '',
    fechaDesde: '',
    fechaHasta: '',
    eficaciaMinima: 0,
    ordenarPor: 'fecha',
    ordenDesc: true,
  });

  // Obtener sugerencias basadas en datos actuales
  const sugerencias = useMemo(() => {
    if (!currentData.campo || !currentData.tipoTratamiento) {
      return [];
    }

    return FumigacionValidator.findSimilarJobs(
      currentData.campo,
      currentData.tipoTratamiento,
      currentData.producto
    );
  }, [currentData.campo, currentData.tipoTratamiento, currentData.producto]);

  // Filtrar y ordenar trabajos pasados
  const trabajosFiltrados = useMemo(() => {
    let result = [...TRABAJOS_PASADOS_MOCK];

    // Aplicar filtros
    if (filtros.busqueda) {
      const searchLower = filtros.busqueda.toLowerCase();
      result = result.filter(
        trabajo =>
          trabajo.nombre.toLowerCase().includes(searchLower) ||
          trabajo.campo.toLowerCase().includes(searchLower) ||
          trabajo.observaciones?.toLowerCase().includes(searchLower) ||
          trabajo.etiquetas.some(etiqueta =>
            etiqueta.toLowerCase().includes(searchLower)
          )
      );
    }

    if (filtros.tipoTratamiento) {
      result = result.filter(
        trabajo => trabajo.tipoTratamiento === filtros.tipoTratamiento
      );
    }

    if (filtros.producto) {
      result = result.filter(trabajo => trabajo.producto === filtros.producto);
    }

    if (filtros.fechaDesde) {
      result = result.filter(
        trabajo => trabajo.fechaRealizada >= filtros.fechaDesde
      );
    }

    if (filtros.fechaHasta) {
      result = result.filter(
        trabajo => trabajo.fechaRealizada <= filtros.fechaHasta
      );
    }

    if (filtros.eficaciaMinima > 0) {
      result = result.filter(
        trabajo =>
          (trabajo.resultados?.efectividad || 0) >= filtros.eficaciaMinima
      );
    }

    // Ordenar
    result.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (filtros.ordenarPor) {
        case 'fecha':
          valueA = new Date(a.fechaRealizada);
          valueB = new Date(b.fechaRealizada);
          break;
        case 'eficacia':
          valueA = a.resultados?.efectividad || 0;
          valueB = b.resultados?.efectividad || 0;
          break;
        case 'costo':
          valueA = a.costo / a.hectareas;
          valueB = b.costo / b.hectareas;
          break;
        case 'hectareas':
          valueA = a.hectareas;
          valueB = b.hectareas;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return filtros.ordenDesc ? 1 : -1;
      if (valueA > valueB) return filtros.ordenDesc ? -1 : 1;
      return 0;
    });

    return result;
  }, [filtros]);

  const handleFiltroChange = (key: keyof FiltrosBusqueda, value: any) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>
            <HistoryIcon />
            Cargar Trabajo Anterior
          </h2>
          <CloseButton onClick={onClose}>
            <TimesIcon />
          </CloseButton>
        </ModalHeader>

        <TabContainer>
          <Tab
            active={activeTab === 'trabajos'}
            onClick={() => setActiveTab('trabajos')}
          >
            <HistoryIcon />
            Trabajos Realizados ({TRABAJOS_PASADOS_MOCK.length})
          </Tab>
          <Tab
            active={activeTab === 'plantillas'}
            onClick={() => setActiveTab('plantillas')}
          >
            <StarIcon />
            Plantillas ({PLANTILLAS_TRABAJO.length})
          </Tab>
        </TabContainer>

        <ContentArea>
          {activeTab === 'trabajos' && (
            <>
              {/* Sugerencias automáticas */}
              {sugerencias.length > 0 && (
                <SugerenciasContainer>
                  <h4>
                    <StarIcon />
                    Trabajos Similares Sugeridos
                  </h4>
                  <p>
                    Basado en campo "{currentData.campo}" y tipo "
                    {currentData.tipoTratamiento}":
                  </p>
                  {sugerencias.slice(0, 2).map(trabajo => (
                    <TrabajoCard
                      key={trabajo.id}
                      onClick={() => onSelectTrabajo(trabajo)}
                    >
                      <TrabajoHeader>
                        <h4>{trabajo.nombre}</h4>
                        <EfectividadBadge
                          eficacia={trabajo.resultados?.efectividad || 0}
                        >
                          {trabajo.resultados?.efectividad || 0}% efectivo
                        </EfectividadBadge>
                      </TrabajoHeader>
                      <TrabajoDetails>
                        <DetailItem>
                          <div className="label">Campo</div>
                          <div className="value">{trabajo.campo}</div>
                        </DetailItem>
                        <DetailItem>
                          <div className="label">Producto</div>
                          <div className="value">{trabajo.producto}</div>
                        </DetailItem>
                        <DetailItem>
                          <div className="label">Costo/ha</div>
                          <div className="value">
                            {formatCurrency(trabajo.costo / trabajo.hectareas)}
                          </div>
                        </DetailItem>
                      </TrabajoDetails>
                      <ActionButtons>
                        <ActionButton variant="primary">
                          <CopyIcon /> Usar como Plantilla
                        </ActionButton>
                      </ActionButtons>
                    </TrabajoCard>
                  ))}
                </SugerenciasContainer>
              )}

              {/* Filtros */}
              <FiltrosContainer>
                <InputGroup>
                  <label>Buscar</label>
                  <SearchInput>
                    <input
                      type="text"
                      placeholder="Nombre, campo, observaciones..."
                      value={filtros.busqueda}
                      onChange={e =>
                        handleFiltroChange('busqueda', e.target.value)
                      }
                    />
                    <SearchIcon className="search-icon" />
                  </SearchInput>
                </InputGroup>

                <InputGroup>
                  <label>Tipo de Tratamiento</label>
                  <Select
                    value={filtros.tipoTratamiento}
                    onChange={e =>
                      handleFiltroChange('tipoTratamiento', e.target.value)
                    }
                  >
                    <option value="">Todos</option>
                    <option value="Preventivo">Preventivo</option>
                    <option value="Correctivo">Correctivo</option>
                    <option value="Curativo">Curativo</option>
                    <option value="Orgánico">Orgánico</option>
                    <option value="Emergencia">Emergencia</option>
                  </Select>
                </InputGroup>

                <InputGroup>
                  <label>Producto</label>
                  <Select
                    value={filtros.producto}
                    onChange={e =>
                      handleFiltroChange('producto', e.target.value)
                    }
                  >
                    <option value="">Todos</option>
                    <option value="Cipermetrina 25%">Cipermetrina 25%</option>
                    <option value="Deltametrina 2.5%">Deltametrina 2.5%</option>
                    <option value="Imidacloprid 20%">Imidacloprid 20%</option>
                    <option value="Aceite de Neem">Aceite de Neem</option>
                  </Select>
                </InputGroup>

                <InputGroup>
                  <label>Eficacia Mínima (%)</label>
                  <RangeInput
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={filtros.eficaciaMinima}
                    onChange={e =>
                      handleFiltroChange(
                        'eficaciaMinima',
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <span>{filtros.eficaciaMinima}%</span>
                </InputGroup>

                <InputGroup>
                  <label>Ordenar Por</label>
                  <Select
                    value={filtros.ordenarPor}
                    onChange={e =>
                      handleFiltroChange('ordenarPor', e.target.value)
                    }
                  >
                    <option value="fecha">Fecha</option>
                    <option value="eficacia">Eficacia</option>
                    <option value="costo">Costo/ha</option>
                    <option value="hectareas">Hectáreas</option>
                  </Select>
                </InputGroup>
              </FiltrosContainer>

              {/* Resultados */}
              <ResultsHeader>
                <h3>Trabajos Encontrados</h3>
                <div className="results-count">
                  {trabajosFiltrados.length} de {TRABAJOS_PASADOS_MOCK.length}{' '}
                  trabajos
                </div>
              </ResultsHeader>

              {trabajosFiltrados.length === 0 ? (
                <EmptyState>
                  <div className="icon">
                    <HistoryIcon />
                  </div>
                  <h3>No se encontraron trabajos</h3>
                  <p>Prueba ajustando los filtros de búsqueda</p>
                </EmptyState>
              ) : (
                trabajosFiltrados.map(trabajo => (
                  <TrabajoCard key={trabajo.id}>
                    <TrabajoHeader>
                      <div>
                        <h4>{trabajo.nombre}</h4>
                        <div className="fecha">
                          {formatDate(trabajo.fechaRealizada)}
                        </div>
                      </div>
                      {trabajo.resultados && (
                        <EfectividadBadge
                          eficacia={trabajo.resultados.efectividad}
                        >
                          {trabajo.resultados.efectividad}% efectivo
                        </EfectividadBadge>
                      )}
                    </TrabajoHeader>

                    <TrabajoDetails>
                      <DetailItem>
                        <div className="label">Campo</div>
                        <div className="value">{trabajo.campo}</div>
                      </DetailItem>
                      <DetailItem>
                        <div className="label">Hectáreas</div>
                        <div className="value">{trabajo.hectareas} ha</div>
                      </DetailItem>
                      <DetailItem>
                        <div className="label">Producto</div>
                        <div className="value">{trabajo.producto}</div>
                      </DetailItem>
                      <DetailItem>
                        <div className="label">Dosis</div>
                        <div className="value">{trabajo.dosis} L/ha</div>
                      </DetailItem>
                      <DetailItem>
                        <div className="label">Tipo</div>
                        <div className="value">{trabajo.tipoTratamiento}</div>
                      </DetailItem>
                      <DetailItem>
                        <div className="label">Costo Total</div>
                        <div className="value">
                          {formatCurrency(trabajo.costo)}
                        </div>
                      </DetailItem>
                      <DetailItem>
                        <div className="label">Costo/ha</div>
                        <div className="value">
                          {formatCurrency(trabajo.costo / trabajo.hectareas)}
                        </div>
                      </DetailItem>
                    </TrabajoDetails>

                    {trabajo.etiquetas.length > 0 && (
                      <EtiquetasContainer>
                        {trabajo.etiquetas.map((etiqueta, index) => (
                          <Etiqueta key={index}>{etiqueta}</Etiqueta>
                        ))}
                      </EtiquetasContainer>
                    )}

                    {trabajo.observaciones && (
                      <DetailItem>
                        <div className="label">Observaciones</div>
                        <div className="value">{trabajo.observaciones}</div>
                      </DetailItem>
                    )}

                    <ActionButtons>
                      <ActionButton
                        variant="primary"
                        onClick={() => onSelectTrabajo(trabajo)}
                      >
                        <CopyIcon /> Usar como Plantilla
                      </ActionButton>
                    </ActionButtons>
                  </TrabajoCard>
                ))
              )}
            </>
          )}

          {activeTab === 'plantillas' && (
            <div>
              <ResultsHeader>
                <h3>Plantillas Disponibles</h3>
                <div className="results-count">
                  {PLANTILLAS_TRABAJO.length} plantillas
                </div>
              </ResultsHeader>

              {PLANTILLAS_TRABAJO.map(plantilla => (
                <TrabajoCard key={plantilla.id}>
                  <TrabajoHeader>
                    <div>
                      <h4>{plantilla.nombre}</h4>
                      <PlantillaDescription>
                        {plantilla.descripcion}
                      </PlantillaDescription>
                    </div>
                    <EfectividadBadge eficacia={plantilla.efectividad}>
                      {plantilla.efectividad}% efectiva
                    </EfectividadBadge>
                  </TrabajoHeader>

                  <TrabajoDetails>
                    <DetailItem>
                      <div className="label">Tipo</div>
                      <div className="value">{plantilla.tipoTratamiento}</div>
                    </DetailItem>
                    <DetailItem>
                      <div className="label">Producto</div>
                      <div className="value">{plantilla.producto}</div>
                    </DetailItem>
                    <DetailItem>
                      <div className="label">Dosis</div>
                      <div className="value">
                        {plantilla.dosisRecomendada} L/ha
                      </div>
                    </DetailItem>
                    <DetailItem>
                      <div className="label">Frecuencia</div>
                      <div className="value">
                        Cada {plantilla.frecuenciaRecomendada} días
                      </div>
                    </DetailItem>
                    <DetailItem>
                      <div className="label">Costo Promedio</div>
                      <div className="value">
                        {formatCurrency(plantilla.costoPromedio)}
                      </div>
                    </DetailItem>
                    <DetailItem>
                      <div className="label">Mejor Época</div>
                      <div className="value">
                        {plantilla.mejorEpoca.join(', ')}
                      </div>
                    </DetailItem>
                  </TrabajoDetails>

                  <ActionButtons>
                    <ActionButton
                      variant="primary"
                      onClick={() => onSelectPlantilla(plantilla)}
                    >
                      <CopyIcon /> Aplicar Plantilla
                    </ActionButton>
                  </ActionButtons>
                </TrabajoCard>
              ))}
            </div>
          )}
        </ContentArea>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TrabajoPasadoSelector;
