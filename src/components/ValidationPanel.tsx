// ==================== COMPONENTE DE VALIDACIÓN AVANZADA ====================

/**
 * Componente integral de validación para formularios de fumigación
 * Incluye validación en tiempo real, sugerencias de mejora y carga de trabajos pasados
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaHistory,
  FaLightbulb,
  FaTimes,
  FaChartLine,
} from 'react-icons/fa';
import {
  FumigacionValidator,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  TrabajoPasado,
  PlantillaTrabajo,
} from '../utils/FumigacionValidator';
import { Fumigacion } from './FumigacionesList';
import TrabajoPasadoSelector from './TrabajoPasadoSelector';

// ==================== TYPE FIXES ====================

// Fix para react-icons
const TriangleIcon = FaExclamationTriangle as React.ComponentType<{
  size?: number;
  className?: string;
}>;
const CheckIcon = FaCheckCircle as React.ComponentType<{ size?: number }>;
const InfoIcon = FaInfoCircle as React.ComponentType<{
  size?: number;
  className?: string;
}>;
const HistoryIcon = FaHistory as React.ComponentType<{ size?: number }>;
const LightbulbIcon = FaLightbulb as React.ComponentType<{ size?: number }>;
const ChartIcon = FaChartLine as React.ComponentType<{ size?: number }>;

// ==================== INTERFACES ====================

interface ValidationPanelProps {
  data: Partial<Fumigacion>;
  onDataChange: (field: keyof Fumigacion, value: any) => void;
  onLoadFromPastWork: (trabajo: TrabajoPasado) => void;
  onApplyTemplate: (plantilla: PlantillaTrabajo) => void;
  className?: string;
}

interface SugerenciaOptimizacion {
  tipo: 'costo' | 'eficacia' | 'tiempo' | 'condiciones';
  mensaje: string;
  accion?: () => void;
  prioridad: 'alta' | 'media' | 'baja';
}

// ==================== STYLED COMPONENTS ====================

const ValidationContainer = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const ValidationHeader = styled.div`
  background: linear-gradient(135deg, #4a7c59, #2d5016);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const StatusBadge = styled.div<{ status: 'valid' | 'warning' | 'error' }>`
  background: ${props =>
    props.status === 'valid'
      ? '#28a745'
      : props.status === 'warning'
        ? '#ffc107'
        : '#dc3545'};
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ValidationContent = styled.div`
  padding: 20px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
`;

const ErrorList = styled.div`
  margin-bottom: 20px;
`;

const ErrorItem = styled.div<{ severity: 'error' | 'warning' }>`
  background: ${props => (props.severity === 'error' ? '#fff5f5' : '#fffbeb')};
  border-left: 4px solid
    ${props => (props.severity === 'error' ? '#dc3545' : '#ffc107')};
  padding: 12px 15px;
  margin-bottom: 8px;
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .icon {
    color: ${props => (props.severity === 'error' ? '#dc3545' : '#ffc107')};
    margin-top: 2px;
  }

  .content {
    flex: 1;

    .field {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${props => (props.severity === 'error' ? '#721c24' : '#856404')};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .message {
      color: ${props => (props.severity === 'error' ? '#721c24' : '#856404')};
      margin-top: 4px;
    }
  }
`;

const WarningItem = styled.div`
  background: #e7f3ff;
  border-left: 4px solid #007bff;
  padding: 12px 15px;
  margin-bottom: 8px;
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .icon {
    color: #007bff;
    margin-top: 2px;
  }

  .content {
    flex: 1;

    .field {
      font-size: 0.85rem;
      font-weight: 600;
      color: #004085;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .message {
      color: #004085;
      margin-top: 4px;
    }

    .suggestion {
      color: #0056b3;
      font-size: 0.9rem;
      margin-top: 6px;
      font-style: italic;
    }
  }
`;

const OptimizacionCard = styled.div<{ prioridad: 'alta' | 'media' | 'baja' }>`
  background: ${props =>
    props.prioridad === 'alta'
      ? '#fff5f5'
      : props.prioridad === 'media'
        ? '#fffbeb'
        : '#f8f9fa'};
  border: 1px solid
    ${props =>
      props.prioridad === 'alta'
        ? '#fecaca'
        : props.prioridad === 'media'
          ? '#fed7aa'
          : '#e9ecef'};
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 10px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    .tipo {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      color: ${props =>
        props.prioridad === 'alta'
          ? '#dc3545'
          : props.prioridad === 'media'
            ? '#fd7e14'
            : '#6c757d'};
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .prioridad {
      background: ${props =>
        props.prioridad === 'alta'
          ? '#dc3545'
          : props.prioridad === 'media'
            ? '#fd7e14'
            : '#6c757d'};
      color: white;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: 500;
    }
  }

  .mensaje {
    color: #333;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const ActionButton = styled.button`
  background: #4a7c59;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #2d5016;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin: 15px 0;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px;
  text-align: center;

  .value {
    font-size: 1.4rem;
    font-weight: bold;
    color: #4a7c59;
    margin-bottom: 4px;
  }

  .label {
    font-size: 0.8rem;
    color: #6c757d;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 0.5px;
  }
`;

const DescriptionText = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
`;

// ==================== COMPONENT ====================

const ValidationPanel: React.FC<ValidationPanelProps> = ({
  data,
  onDataChange,
  onLoadFromPastWork,
  onApplyTemplate,
  className,
}) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    errors: [],
    warnings: [],
  });
  const [showPastWorkSelector, setShowPastWorkSelector] = useState(false);
  const [optimizaciones, setOptimizaciones] = useState<
    SugerenciaOptimizacion[]
  >([]);

  // Validación en tiempo real
  useEffect(() => {
    const result = FumigacionValidator.validate(data);
    setValidationResult(result);

    // Generar optimizaciones
    generateOptimizations();
  }, [data]);

  const generateOptimizations = useCallback(() => {
    const sugerencias: SugerenciaOptimizacion[] = [];

    // Optimización de costo
    if (data.producto && data.hectareas) {
      const estimacion = FumigacionValidator.estimateCost(
        data.producto,
        data.hectareas,
        data.tipoTratamiento || 'Preventivo'
      );

      if (data.costo && data.costo > estimacion.promedio * 1.2) {
        sugerencias.push({
          tipo: 'costo',
          mensaje: `El costo está ${((data.costo / estimacion.promedio - 1) * 100).toFixed(0)}% por encima del promedio. Considera revisar proveedores o dosis.`,
          prioridad: 'media',
        });
      }
    }

    // Optimización de condiciones
    if (data.condicionesClimaticas) {
      const { temperatura, humedad, viento } = data.condicionesClimaticas;

      if (temperatura && (temperatura < 15 || temperatura > 30)) {
        sugerencias.push({
          tipo: 'condiciones',
          mensaje:
            'La temperatura no es óptima. Considera reprogramar para mejores condiciones.',
          prioridad: 'alta',
        });
      }

      if (humedad && humedad > 85) {
        sugerencias.push({
          tipo: 'condiciones',
          mensaje:
            'Humedad alta puede reducir eficacia. Aplica temprano en la mañana.',
          prioridad: 'media',
        });
      }
    }

    // Sugerencia de plantilla
    if (data.tipoTratamiento && !data.nombre) {
      const plantilla = FumigacionValidator.getRecommendedTemplate(
        data.tipoTratamiento
      );
      if (plantilla) {
        sugerencias.push({
          tipo: 'eficacia',
          mensaje: `Plantilla "${plantilla.nombre}" disponible con ${plantilla.efectividad}% de efectividad`,
          prioridad: 'baja',
        });
      }
    }

    setOptimizaciones(sugerencias);
  }, [data]);

  const handleLoadPastWork = (trabajo: TrabajoPasado) => {
    onLoadFromPastWork(trabajo);
    setShowPastWorkSelector(false);
  };

  const handleApplyTemplate = (plantilla: PlantillaTrabajo) => {
    onApplyTemplate(plantilla);
    setShowPastWorkSelector(false);
  };

  const getStatusInfo = () => {
    if (validationResult.errors.length > 0) {
      return {
        status: 'error' as const,
        text: `${validationResult.errors.length} errores`,
        icon: <TriangleIcon />,
      };
    }

    if (validationResult.warnings.length > 0) {
      return {
        status: 'warning' as const,
        text: `${validationResult.warnings.length} advertencias`,
        icon: <InfoIcon />,
      };
    }

    return {
      status: 'valid' as const,
      text: 'Válido',
      icon: <CheckIcon />,
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <ValidationContainer className={className}>
        <ValidationHeader>
          <h3>
            <CheckIcon />
            Validación y Optimización
          </h3>
          <StatusBadge status={statusInfo.status}>
            {statusInfo.icon}
            {statusInfo.text}
          </StatusBadge>
        </ValidationHeader>

        <ValidationContent>
          {/* Estadísticas rápidas */}
          {data.hectareas && data.costo && (
            <StatsGrid>
              <StatCard>
                <div className="value">
                  {new Intl.NumberFormat('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                  }).format(data.costo / data.hectareas)}
                </div>
                <div className="label">Costo/Ha</div>
              </StatCard>
              {data.producto && (
                <StatCard>
                  <div className="value">
                    {FumigacionValidator.estimateCost(
                      data.producto,
                      data.hectareas,
                      data.tipoTratamiento || 'Preventivo'
                    ).promedio > data.costo
                      ? '↓'
                      : '↑'}
                  </div>
                  <div className="label">vs Promedio</div>
                </StatCard>
              )}
            </StatsGrid>
          )}

          {/* Errores */}
          {validationResult.errors.length > 0 && (
            <>
              <SectionTitle>
                <TriangleIcon />
                Errores que deben corregirse
              </SectionTitle>
              <ErrorList>
                {validationResult.errors.map((error, index) => (
                  <ErrorItem key={index} severity={error.severity}>
                    <TriangleIcon size={16} />
                    <div className="content">
                      <div className="field">{error.field}</div>
                      <div className="message">{error.message}</div>
                    </div>
                  </ErrorItem>
                ))}
              </ErrorList>
            </>
          )}

          {/* Advertencias */}
          {validationResult.warnings.length > 0 && (
            <>
              <SectionTitle>
                <InfoIcon />
                Advertencias y sugerencias
              </SectionTitle>
              <ErrorList>
                {validationResult.warnings.map((warning, index) => (
                  <WarningItem key={index}>
                    <InfoIcon size={16} />
                    <div className="content">
                      <div className="field">{warning.field}</div>
                      <div className="message">{warning.message}</div>
                      {warning.suggestion && (
                        <div className="suggestion">
                          💡 {warning.suggestion}
                        </div>
                      )}
                    </div>
                  </WarningItem>
                ))}
              </ErrorList>
            </>
          )}

          {/* Optimizaciones */}
          {optimizaciones.length > 0 && (
            <>
              <SectionTitle>
                <LightbulbIcon />
                Sugerencias de optimización
              </SectionTitle>
              {optimizaciones.map((opt, index) => (
                <OptimizacionCard key={index} prioridad={opt.prioridad}>
                  <div className="header">
                    <div className="tipo">
                      <ChartIcon />
                      {opt.tipo}
                    </div>
                    <div className="prioridad">{opt.prioridad}</div>
                  </div>
                  <div className="mensaje">{opt.mensaje}</div>
                </OptimizacionCard>
              ))}
            </>
          )}

          {/* Carga de trabajos pasados */}
          <SectionTitle>
            <HistoryIcon />
            Trabajos anteriores
          </SectionTitle>
          <DescriptionText>
            Carga configuraciones de trabajos exitosos anteriores o aplica
            plantillas optimizadas
          </DescriptionText>
          <ActionButton onClick={() => setShowPastWorkSelector(true)}>
            <HistoryIcon />
            Cargar trabajo anterior
          </ActionButton>
        </ValidationContent>
      </ValidationContainer>

      {/* Modal de selección de trabajos pasados */}
      <TrabajoPasadoSelector
        isOpen={showPastWorkSelector}
        onClose={() => setShowPastWorkSelector(false)}
        onSelectTrabajo={handleLoadPastWork}
        onSelectPlantilla={handleApplyTemplate}
        currentData={data}
      />
    </>
  );
};

export default ValidationPanel;
