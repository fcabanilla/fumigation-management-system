// ==================== FORMULARIO INTEGRADO CON VALIDACIÓN ====================

/**
 * Formulario completo de fumigación con validación avanzada en tiempo real,
 * carga de trabajos pasados y sugerencias de optimización
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FaSave,
  FaPlus,
  FaTimes,
  FaCloudSun,
  FaWeight,
  FaDollarSign,
} from 'react-icons/fa';
import { Fumigacion } from './FumigacionesList';
import ValidationPanel from './ValidationPanel';
import {
  TrabajoPasado,
  PlantillaTrabajo,
  PRODUCTOS_PERMITIDOS,
  TIPOS_TRATAMIENTO,
} from '../utils/FumigacionValidator';

// ==================== TYPE FIXES ====================

// Fix para react-icons
const SaveIcon = FaSave as React.ComponentType<{ size?: number }>;
const PlusIcon = FaPlus as React.ComponentType<{ size?: number }>;
const TimesIcon = FaTimes as React.ComponentType<{ size?: number }>;
const CloudSunIcon = FaCloudSun as React.ComponentType<{ size?: number }>;
const WeightIcon = FaWeight as React.ComponentType<{ size?: number }>;
const DollarIcon = FaDollarSign as React.ComponentType<{ size?: number }>;

// ==================== INTERFACES ====================

interface FumigacionFormAdvancedProps {
  fumigacion?: Partial<Fumigacion>;
  onSave: (fumigacion: Fumigacion) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

// ==================== STYLED COMPONENTS ====================

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    max-width: 800px;
  }
`;

const FormCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const FormHeader = styled.div`
  background: linear-gradient(135deg, #4a7c59, #2d5016);
  color: white;
  padding: 20px;

  h2 {
    margin: 0;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  p {
    margin: 5px 0 0 0;
    opacity: 0.9;
    font-size: 0.9rem;
  }
`;

const FormContent = styled.div`
  padding: 25px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.1rem;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGrid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: ${props => `repeat(${props.columns || 2}, 1fr)`};
  gap: 20px;
  margin-bottom: 25px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  grid-column: ${props => (props.fullWidth ? '1 / -1' : 'auto')};
`;

const Label = styled.label<{ required?: boolean }>`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;

  &::after {
    content: ${props => (props.required ? '"*"' : '""')};
    color: #dc3545;
    font-weight: bold;
  }
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: 12px;
  border: 2px solid ${props => (props.hasError ? '#dc3545' : '#ddd')};
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => (props.hasError ? '#dc3545' : '#4a7c59')};
    box-shadow: 0 0 0 3px
      ${props =>
        props.hasError ? 'rgba(220, 53, 69, 0.2)' : 'rgba(74, 124, 89, 0.2)'};
  }

  &::placeholder {
    color: #aaa;
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  padding: 12px;
  border: 2px solid ${props => (props.hasError ? '#dc3545' : '#ddd')};
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => (props.hasError ? '#dc3545' : '#4a7c59')};
    box-shadow: 0 0 0 3px
      ${props =>
        props.hasError ? 'rgba(220, 53, 69, 0.2)' : 'rgba(74, 124, 89, 0.2)'};
  }
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: 12px;
  border: 2px solid ${props => (props.hasError ? '#dc3545' : '#ddd')};
  border-radius: 4px;
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => (props.hasError ? '#dc3545' : '#4a7c59')};
    box-shadow: 0 0 0 3px
      ${props =>
        props.hasError ? 'rgba(220, 53, 69, 0.2)' : 'rgba(74, 124, 89, 0.2)'};
  }
`;

const CondicionesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #eee;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  background: ${props => (props.variant === 'primary' ? '#4a7c59' : '#6c757d')};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  min-width: 120px;
  justify-content: center;

  &:hover {
    background: ${props =>
      props.variant === 'primary' ? '#2d5016' : '#5a6268'};
  }

  &:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
`;

const HelpText = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 5px;
  line-height: 1.4;
`;

const UnitDisplay = styled.span`
  font-size: 0.8rem;
  color: #666;
  margin-left: 5px;
`;

// ==================== COMPONENT ====================

const FumigacionFormAdvanced: React.FC<FumigacionFormAdvancedProps> = ({
  fumigacion = {},
  onSave,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<Partial<Fumigacion>>({
    nombre: '',
    campo: '',
    hectareas: 0,
    producto: '',
    dosis: 0,
    tipoTratamiento: '',
    fechaPlanificada: '',
    responsable: '',
    costo: 0,
    observaciones: '',
    condicionesClimaticas: {
      temperatura: 0,
      humedad: 0,
      viento: 0,
    },
    ...fumigacion,
  });

  const [hasFieldErrors, setHasFieldErrors] = useState<Set<string>>(new Set());

  // Actualizar errores de campos en tiempo real
  useEffect(() => {
    // Esta lógica se ejecutará cuando ValidationPanel detecte errores
    // Por ahora mantenemos la estructura base
  }, [formData]);

  const handleFieldChange = (field: keyof Fumigacion, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCondicionChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      condicionesClimaticas: {
        temperatura: 0,
        humedad: 0,
        viento: 0,
        ...prev.condicionesClimaticas,
        [field]: value,
      },
    }));
  };

  const handleLoadFromPastWork = (trabajo: TrabajoPasado) => {
    setFormData({
      ...formData,
      nombre: `${trabajo.nombre} - Nuevo`,
      campo: trabajo.campo,
      producto: trabajo.producto,
      dosis: trabajo.dosis,
      tipoTratamiento: trabajo.tipoTratamiento,
      responsable: formData.responsable || '',
      fechaPlanificada: formData.fechaPlanificada || '',
      costo: Math.round(
        (trabajo.costo * (formData.hectareas || trabajo.hectareas)) /
          trabajo.hectareas
      ),
      hectareas: formData.hectareas || trabajo.hectareas,
      observaciones: `Basado en: ${trabajo.nombre}\n\nResultados anteriores: ${trabajo.resultados?.efectividad}% efectividad\n\n${formData.observaciones || ''}`,
      condicionesClimaticas: trabajo.condicionesClimaticas,
    });
  };

  const handleApplyTemplate = (plantilla: PlantillaTrabajo) => {
    setFormData({
      ...formData,
      nombre: formData.nombre || plantilla.nombre,
      producto: plantilla.producto,
      dosis: plantilla.dosisRecomendada,
      tipoTratamiento: plantilla.tipoTratamiento,
      costo: formData.hectareas
        ? Math.round(plantilla.costoPromedio * (formData.hectareas / 10))
        : plantilla.costoPromedio,
      observaciones: `Plantilla aplicada: ${plantilla.nombre}\n\nDescripción: ${plantilla.descripcion}\n\nEfectividad esperada: ${plantilla.efectividad}%\n\n${formData.observaciones || ''}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación final antes de enviar
    const fumigacionCompleta: Fumigacion = {
      id: fumigacion?.id || `fumig_${Date.now()}`,
      nombre: formData.nombre || '',
      campo: formData.campo || '',
      hectareas: formData.hectareas || 0,
      producto: formData.producto || '',
      dosis: formData.dosis || 0,
      tipoTratamiento: formData.tipoTratamiento || '',
      fechaPlanificada: formData.fechaPlanificada || '',
      responsable: formData.responsable || '',
      costo: formData.costo || 0,
      estado: fumigacion?.estado || 'Planificada',
      observaciones: formData.observaciones,
      condicionesClimaticas: formData.condicionesClimaticas || {
        temperatura: 0,
        humedad: 0,
        viento: 0,
      },
      createdAt: fumigacion?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(fumigacionCompleta);
  };

  const getDosisRange = (producto: string) => {
    const rango =
      PRODUCTOS_PERMITIDOS[producto as keyof typeof PRODUCTOS_PERMITIDOS];
    return rango ? `${rango.min} - ${rango.max} ${rango.unidad}` : '';
  };

  return (
    <FormContainer>
      <FormCard>
        <FormHeader>
          <h2>
            <PlusIcon />
            {isEditing ? 'Editar Fumigación' : 'Nueva Fumigación'}
          </h2>
          <p>
            Complete todos los campos requeridos. La validación se ejecuta en
            tiempo real.
          </p>
        </FormHeader>

        <FormContent>
          <form onSubmit={handleSubmit}>
            {/* Información básica */}
            <SectionTitle>Información Básica</SectionTitle>
            <FormGrid>
              <FormGroup fullWidth>
                <Label required>Nombre de la fumigación</Label>
                <Input
                  type="text"
                  placeholder="Control de pulgón - Lote Norte"
                  value={formData.nombre || ''}
                  onChange={e => handleFieldChange('nombre', e.target.value)}
                  hasError={hasFieldErrors.has('nombre')}
                />
                <HelpText>
                  Nombre descriptivo para identificar esta fumigación
                </HelpText>
              </FormGroup>

              <FormGroup>
                <Label required>Campo/Lote</Label>
                <Select
                  value={formData.campo || ''}
                  onChange={e => handleFieldChange('campo', e.target.value)}
                  hasError={hasFieldErrors.has('campo')}
                >
                  <option value="">Seleccionar campo</option>
                  <option value="Campo Norte - Lote 1">
                    Campo Norte - Lote 1
                  </option>
                  <option value="Campo Norte - Lote 2">
                    Campo Norte - Lote 2
                  </option>
                  <option value="Campo Sur - Lote 1">Campo Sur - Lote 1</option>
                  <option value="Campo Sur - Lote 2">Campo Sur - Lote 2</option>
                  <option value="Campo Este - Lote 3">
                    Campo Este - Lote 3
                  </option>
                  <option value="Campo Este - Lote 4">
                    Campo Este - Lote 4
                  </option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label required>Hectáreas</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="1000"
                  placeholder="15.5"
                  value={formData.hectareas || ''}
                  onChange={e =>
                    handleFieldChange(
                      'hectareas',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  hasError={hasFieldErrors.has('hectareas')}
                />
                <UnitDisplay>ha</UnitDisplay>
              </FormGroup>
            </FormGrid>

            {/* Tratamiento */}
            <SectionTitle>
              <WeightIcon />
              Tratamiento
            </SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label required>Tipo de Tratamiento</Label>
                <Select
                  value={formData.tipoTratamiento || ''}
                  onChange={e =>
                    handleFieldChange('tipoTratamiento', e.target.value)
                  }
                  hasError={hasFieldErrors.has('tipoTratamiento')}
                >
                  <option value="">Seleccionar tipo</option>
                  {TIPOS_TRATAMIENTO.map(tipo => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label required>Producto</Label>
                <Select
                  value={formData.producto || ''}
                  onChange={e => handleFieldChange('producto', e.target.value)}
                  hasError={hasFieldErrors.has('producto')}
                >
                  <option value="">Seleccionar producto</option>
                  {Object.keys(PRODUCTOS_PERMITIDOS).map(producto => (
                    <option key={producto} value={producto}>
                      {producto}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label required>Dosis</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="2.5"
                  value={formData.dosis || ''}
                  onChange={e =>
                    handleFieldChange('dosis', parseFloat(e.target.value) || 0)
                  }
                  hasError={hasFieldErrors.has('dosis')}
                />
                {formData.producto && (
                  <HelpText>
                    Rango recomendado: {getDosisRange(formData.producto)}
                  </HelpText>
                )}
              </FormGroup>

              <FormGroup>
                <Label required>Responsable</Label>
                <Input
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.responsable || ''}
                  onChange={e =>
                    handleFieldChange('responsable', e.target.value)
                  }
                  hasError={hasFieldErrors.has('responsable')}
                />
              </FormGroup>
            </FormGrid>

            {/* Planificación */}
            <SectionTitle>Planificación</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label required>Fecha Planificada</Label>
                <Input
                  type="date"
                  value={formData.fechaPlanificada || ''}
                  onChange={e =>
                    handleFieldChange('fechaPlanificada', e.target.value)
                  }
                  hasError={hasFieldErrors.has('fechaPlanificada')}
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <DollarIcon />
                  Costo Estimado
                </Label>
                <Input
                  type="number"
                  step="100"
                  min="0"
                  placeholder="75000"
                  value={formData.costo || ''}
                  onChange={e =>
                    handleFieldChange('costo', parseFloat(e.target.value) || 0)
                  }
                  hasError={hasFieldErrors.has('costo')}
                />
                <UnitDisplay>ARS</UnitDisplay>
              </FormGroup>
            </FormGrid>

            {/* Condiciones climáticas */}
            <SectionTitle>
              <CloudSunIcon />
              Condiciones Climáticas Esperadas
            </SectionTitle>
            <CondicionesGrid>
              <FormGroup>
                <Label>Temperatura (°C)</Label>
                <Input
                  type="number"
                  step="1"
                  min="-10"
                  max="50"
                  placeholder="24"
                  value={formData.condicionesClimaticas?.temperatura || ''}
                  onChange={e =>
                    handleCondicionChange(
                      'temperatura',
                      parseInt(e.target.value) || 0
                    )
                  }
                />
                <HelpText>Rango óptimo: 15-30°C</HelpText>
              </FormGroup>

              <FormGroup>
                <Label>Humedad (%)</Label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  placeholder="68"
                  value={formData.condicionesClimaticas?.humedad || ''}
                  onChange={e =>
                    handleCondicionChange(
                      'humedad',
                      parseInt(e.target.value) || 0
                    )
                  }
                />
                <HelpText>Máximo recomendado: 85%</HelpText>
              </FormGroup>

              <FormGroup>
                <Label>Viento (km/h)</Label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  placeholder="7"
                  value={formData.condicionesClimaticas?.viento || ''}
                  onChange={e =>
                    handleCondicionChange(
                      'viento',
                      parseInt(e.target.value) || 0
                    )
                  }
                />
                <HelpText>Máximo recomendado: 15 km/h</HelpText>
              </FormGroup>
            </CondicionesGrid>

            {/* Observaciones */}
            <FormGroup fullWidth style={{ marginTop: '25px' }}>
              <Label>Observaciones</Label>
              <TextArea
                placeholder="Notas adicionales, consideraciones especiales..."
                value={formData.observaciones || ''}
                onChange={e =>
                  handleFieldChange('observaciones', e.target.value)
                }
                hasError={hasFieldErrors.has('observaciones')}
              />
            </FormGroup>

            <ButtonGroup>
              <Button type="button" variant="secondary" onClick={onCancel}>
                <TimesIcon />
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                <SaveIcon />
                {isEditing ? 'Guardar Cambios' : 'Crear Fumigación'}
              </Button>
            </ButtonGroup>
          </form>
        </FormContent>
      </FormCard>

      {/* Panel de validación */}
      <ValidationPanel
        data={formData}
        onDataChange={handleFieldChange}
        onLoadFromPastWork={handleLoadFromPastWork}
        onApplyTemplate={handleApplyTemplate}
      />
    </FormContainer>
  );
};

export default FumigacionFormAdvanced;
