import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaSave, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { GiSpray } from 'react-icons/gi';
import { MapEditor } from './MapComponent';
import MapEditorAdvanced from './MapEditorAdvanced';
import LoteSelector from './LoteSelector';
import * as turf from '@turf/turf';

// Styled Components
const FormContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 100%);
  padding: 2rem;
`;

const FormCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const FormHeader = styled.div`
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  padding: 2rem;
  color: white;
  text-align: center;
  position: relative;
`;

const FormTitle = styled.h1`
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1.8rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const FormBody = styled.div`
  padding: 2.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #2d5016;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RequiredMark = styled.span`
  color: #f44336;
  font-size: 1.2rem;
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #4a7c59;
    box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
  }

  &.error {
    border-color: #f44336;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a7c59;
    box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
  }

  &.error {
    border-color: #f44336;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a7c59;
    box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
  }

  &.error {
    border-color: #f44336;
  }
`;

const ErrorMessage = styled.span`
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

const InfoText = styled.span`
  color: #666;
  font-size: 0.85rem;
  font-style: italic;
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  font-size: 1rem;
  min-width: 140px;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(74, 124, 89, 0.3);

  &:hover:not(:disabled) {
    box-shadow: 0 6px 25px rgba(74, 124, 89, 0.4);
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #666;
  border: 2px solid #e0e0e0;

  &:hover:not(:disabled) {
    background: #f5f5f5;
  }
`;

const PreviewSection = styled.div`
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const PreviewTitle = styled.h3`
  color: #2d5016;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PreviewGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const PreviewItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PreviewLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PreviewValue = styled.span`
  font-weight: 500;
  color: #2d5016;
`;

// Estados y tipos de tratamiento
const TIPOS_TRATAMIENTO = [
  { value: '', label: 'Selecciona tipo de tratamiento' },
  { value: 'Preventivo', label: 'Preventivo' },
  { value: 'Correctivo', label: 'Correctivo' },
  { value: 'Masivo', label: 'Masivo' },
  { value: 'Selectivo', label: 'Selectivo' },
];

const TIPOS_PRODUCTO = [
  { value: '', label: 'Selecciona tipo de producto' },
  {
    value: 'Insecticida Organofosforado',
    label: 'Insecticida Organofosforado',
  },
  { value: 'Insecticida Piretroide', label: 'Insecticida Piretroide' },
  { value: 'Fungicida Sistémico', label: 'Fungicida Sistémico' },
  { value: 'Fungicida de Contacto', label: 'Fungicida de Contacto' },
  { value: 'Herbicida Pre-emergente', label: 'Herbicida Pre-emergente' },
  { value: 'Herbicida Post-emergente', label: 'Herbicida Post-emergente' },
  { value: 'Acaricida', label: 'Acaricida' },
  { value: 'Nematicida', label: 'Nematicida' },
];

const EQUIPOS_FUMIGACION = [
  { value: '', label: 'Selecciona equipo' },
  { value: 'Pulverizador Manual', label: 'Pulverizador Manual' },
  { value: 'Pulverizador de Arrastre', label: 'Pulverizador de Arrastre' },
  {
    value: 'Pulverizador Autopropulsado',
    label: 'Pulverizador Autopropulsado',
  },
  { value: 'Avión Fumigador', label: 'Avión Fumigador' },
  { value: 'Dron de Fumigación', label: 'Dron de Fumigación' },
  { value: 'Nebulizador', label: 'Nebulizador' },
];

const ESTADOS_FUMIGACION = [
  { value: 'PLANIFICADA', label: 'Planificada' },
  { value: 'EN_PROCESO', label: 'En Proceso' },
  { value: 'COMPLETADA', label: 'Completada' },
  { value: 'CANCELADA', label: 'Cancelada' },
];

const FumigacionForm = ({ fumigacion, onSave, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    campo: '',
    tipoTratamiento: '',
    producto: '',
    dosis: '',
    fechaPlanificada: '',
    fechaRealizada: '',
    estado: 'PLANIFICADA',
    hectareas: '',
    costo: '',
    responsable: '',
    equipoUtilizado: '',
    observaciones: '',
    geometria: null, // Nueva: geometría GeoJSON del campo
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Estados del selector de lotes
  const [loteMode, setLoteMode] = useState('existing'); // 'new' o 'existing'
  const [selectedLoteId, setSelectedLoteId] = useState(null);

  // Cargar datos para edición
  useEffect(() => {
    if (fumigacion && isEdit) {
      setFormData({
        nombre: fumigacion.nombre || '',
        campo: fumigacion.campo || '',
        tipoTratamiento: fumigacion.tipoTratamiento || '',
        producto: fumigacion.producto || '',
        dosis: fumigacion.dosis?.toString() || '',
        fechaPlanificada: fumigacion.fechaPlanificada?.split('T')[0] || '',
        fechaRealizada: fumigacion.fechaRealizada?.split('T')[0] || '',
        estado: fumigacion.estado || 'PLANIFICADA',
        hectareas: fumigacion.hectareas?.toString() || '',
        costo: fumigacion.costo?.toString() || '',
        responsable: fumigacion.responsable || '',
        equipoUtilizado: fumigacion.equipoUtilizado || '',
        observaciones: fumigacion.observaciones || '',
        geometria: fumigacion.geometria || null,
      });
    }
  }, [fumigacion, isEdit]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleGeometriaChange = geometry => {
    setFormData(prev => ({
      ...prev,
      geometria: geometry,
    }));

    // Calcular área automáticamente si la geometría es válida
    if (geometry && geometry.coordinates && geometry.coordinates.length > 0) {
      try {
        const area = turf.area(geometry);
        const areaHectares = (area / 10000).toFixed(2); // m² to hectares
        setFormData(prev => ({
          ...prev,
          tamanoHectareas: areaHectares,
        }));
      } catch (error) {
        // Error calculando área
      }
    }
  };

  // Funciones del selector de lotes
  const handleModeChange = mode => {
    setLoteMode(mode);
    if (mode === 'new') {
      setSelectedLoteId(null);
      setFormData(prev => ({ ...prev, geometria: null }));
    }
  };

  const handleLoteSelect = lote => {
    setSelectedLoteId(lote.id);
    setFormData(prev => ({
      ...prev,
      geometria: lote.geometria,
      campo: lote.nombre,
      hectareas: lote.hectareas?.toString() || '',
    }));
  };

  const handleViewLote = lote => {
    // Aquí podrías abrir un modal o navegar a la vista del lote
    // Por ahora solo mostramos información en consola
    // eslint-disable-next-line no-console
    console.log(`Ver detalles de: ${lote.nombre}`);
  };

  const handleNewLote = () => {
    // Aquí podrías navegar a la gestión de lotes
    // Por ahora solo mostramos información en consola
    // eslint-disable-next-line no-console
    console.log('Redirigir a Gestión de Lotes para crear un nuevo lote');
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones requeridas
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.campo.trim()) {
      newErrors.campo = 'El campo es requerido';
    }

    if (!formData.tipoTratamiento) {
      newErrors.tipoTratamiento = 'Selecciona un tipo de tratamiento';
    }

    if (!formData.producto) {
      newErrors.producto = 'Selecciona un producto';
    }

    if (!formData.dosis || parseFloat(formData.dosis) <= 0) {
      newErrors.dosis = 'La dosis debe ser mayor a 0';
    }

    if (!formData.fechaPlanificada) {
      newErrors.fechaPlanificada = 'La fecha planificada es requerida';
    }

    if (!formData.hectareas || parseFloat(formData.hectareas) <= 0) {
      newErrors.hectareas = 'Las hectáreas deben ser mayores a 0';
    }

    if (!formData.responsable.trim()) {
      newErrors.responsable = 'El responsable es requerido';
    }

    if (!formData.equipoUtilizado) {
      newErrors.equipoUtilizado = 'Selecciona un equipo';
    }

    // Validación de fechas
    if (formData.fechaPlanificada && formData.fechaRealizada) {
      const planificada = new Date(formData.fechaPlanificada);
      const realizada = new Date(formData.fechaRealizada);

      if (realizada < planificada) {
        newErrors.fechaRealizada =
          'La fecha realizada no puede ser anterior a la planificada';
      }
    }

    // Validar estado y fecha realizada
    if (formData.estado === 'COMPLETADA' && !formData.fechaRealizada) {
      newErrors.fechaRealizada =
        'La fecha de realización es requerida para fumigaciones completadas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const fumigacionData = {
        ...formData,
        dosis: parseFloat(formData.dosis),
        hectareas: parseFloat(formData.hectareas),
        costo: formData.costo ? parseFloat(formData.costo) : 0,
        fechaPlanificada: formData.fechaPlanificada,
        fechaRealizada: formData.fechaRealizada || null,
        updatedAt: new Date().toISOString(),
      };

      if (!isEdit) {
        fumigacionData.id = Date.now().toString();
        fumigacionData.createdAt = new Date().toISOString();
      }

      // Simular delay de guardado
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onSave) {
        onSave(fumigacionData);
      }
    } catch (error) {
      // Error handling - en una app real mostrarías un toast/notification
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = value => {
    if (!value) {
      return '';
    }
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
  };

  const formatDate = dateString => {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <FormContainer>
      <FormCard>
        <FormHeader>
          <FormTitle>
            <GiSpray />
            {isEdit ? 'Editar Fumigación' : 'Nueva Fumigación'}
          </FormTitle>
          <CloseButton onClick={onCancel} type="button">
            <FaTimes />
          </CloseButton>
        </FormHeader>

        <FormBody>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup className="full-width">
                <Label>
                  Nombre de la Fumigación <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={errors.nombre ? 'error' : ''}
                  placeholder="Ej: Tratamiento Preventivo Campo Norte"
                  maxLength={100}
                />
                {errors.nombre && <ErrorMessage>{errors.nombre}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>
                  Campo <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  type="text"
                  name="campo"
                  value={formData.campo}
                  onChange={handleInputChange}
                  className={errors.campo ? 'error' : ''}
                  placeholder="Ej: Campo Norte - Lote A"
                />
                {errors.campo && <ErrorMessage>{errors.campo}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>
                  Tipo de Tratamiento <RequiredMark>*</RequiredMark>
                </Label>
                <Select
                  name="tipoTratamiento"
                  value={formData.tipoTratamiento}
                  onChange={handleInputChange}
                  className={errors.tipoTratamiento ? 'error' : ''}
                >
                  {TIPOS_TRATAMIENTO.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </Select>
                {errors.tipoTratamiento && (
                  <ErrorMessage>{errors.tipoTratamiento}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  Producto <RequiredMark>*</RequiredMark>
                </Label>
                <Select
                  name="producto"
                  value={formData.producto}
                  onChange={handleInputChange}
                  className={errors.producto ? 'error' : ''}
                >
                  {TIPOS_PRODUCTO.map(producto => (
                    <option key={producto.value} value={producto.value}>
                      {producto.label}
                    </option>
                  ))}
                </Select>
                {errors.producto && (
                  <ErrorMessage>{errors.producto}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  Dosis (L/ha) <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  type="number"
                  name="dosis"
                  value={formData.dosis}
                  onChange={handleInputChange}
                  className={errors.dosis ? 'error' : ''}
                  step="0.1"
                  min="0.1"
                  placeholder="2.5"
                />
                {errors.dosis && <ErrorMessage>{errors.dosis}</ErrorMessage>}
                <InfoText>Litros por hectárea</InfoText>
              </FormGroup>

              <FormGroup>
                <Label>
                  Fecha Planificada <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  type="date"
                  name="fechaPlanificada"
                  value={formData.fechaPlanificada}
                  onChange={handleInputChange}
                  className={errors.fechaPlanificada ? 'error' : ''}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.fechaPlanificada && (
                  <ErrorMessage>{errors.fechaPlanificada}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Fecha Realizada</Label>
                <Input
                  type="date"
                  name="fechaRealizada"
                  value={formData.fechaRealizada}
                  onChange={handleInputChange}
                  className={errors.fechaRealizada ? 'error' : ''}
                />
                {errors.fechaRealizada && (
                  <ErrorMessage>{errors.fechaRealizada}</ErrorMessage>
                )}
                <InfoText>
                  Solo completar cuando se realice la fumigación
                </InfoText>
              </FormGroup>

              <FormGroup>
                <Label>Estado</Label>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                >
                  {ESTADOS_FUMIGACION.map(estado => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>
                  Hectáreas <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  type="number"
                  name="hectareas"
                  value={formData.hectareas}
                  onChange={handleInputChange}
                  className={errors.hectareas ? 'error' : ''}
                  step="0.1"
                  min="0.1"
                  placeholder="45.5"
                />
                {errors.hectareas && (
                  <ErrorMessage>{errors.hectareas}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup className="full-width">
                <LoteSelector
                  mode={loteMode}
                  onModeChange={handleModeChange}
                  selectedLoteId={selectedLoteId}
                  onLoteSelect={handleLoteSelect}
                  onViewLote={handleViewLote}
                  onNewLote={handleNewLote}
                />

                {loteMode === 'new' && (
                  <MapEditorAdvanced
                    geometry={formData.geometria}
                    onGeometryChange={handleGeometriaChange}
                    height="600px"
                    showStats={true}
                    title="🗺️ Definir Área de Fumigación"
                  />
                )}
              </FormGroup>

              <FormGroup>
                <Label>Costo Estimado (ARS)</Label>
                <Input
                  type="number"
                  name="costo"
                  value={formData.costo}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="12500.00"
                />
                <InfoText>Opcional - se puede completar después</InfoText>
              </FormGroup>

              <FormGroup>
                <Label>
                  Responsable <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  type="text"
                  name="responsable"
                  value={formData.responsable}
                  onChange={handleInputChange}
                  className={errors.responsable ? 'error' : ''}
                  placeholder="Nombre del responsable"
                />
                {errors.responsable && (
                  <ErrorMessage>{errors.responsable}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  Equipo Utilizado <RequiredMark>*</RequiredMark>
                </Label>
                <Select
                  name="equipoUtilizado"
                  value={formData.equipoUtilizado}
                  onChange={handleInputChange}
                  className={errors.equipoUtilizado ? 'error' : ''}
                >
                  {EQUIPOS_FUMIGACION.map(equipo => (
                    <option key={equipo.value} value={equipo.value}>
                      {equipo.label}
                    </option>
                  ))}
                </Select>
                {errors.equipoUtilizado && (
                  <ErrorMessage>{errors.equipoUtilizado}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup className="full-width">
                <Label>Observaciones</Label>
                <Textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  placeholder="Condiciones especiales, recomendaciones, notas adicionales..."
                  maxLength={500}
                />
                <InfoText>
                  {formData.observaciones.length}/500 caracteres
                </InfoText>
              </FormGroup>
            </FormGrid>

            {/* Preview Section */}
            {showPreview && formData.nombre && (
              <PreviewSection>
                <PreviewTitle>
                  <FaEye />
                  Vista Previa
                </PreviewTitle>
                <PreviewGrid>
                  <PreviewItem>
                    <PreviewLabel>Nombre</PreviewLabel>
                    <PreviewValue>{formData.nombre}</PreviewValue>
                  </PreviewItem>
                  <PreviewItem>
                    <PreviewLabel>Campo</PreviewLabel>
                    <PreviewValue>{formData.campo}</PreviewValue>
                  </PreviewItem>
                  <PreviewItem>
                    <PreviewLabel>Tratamiento</PreviewLabel>
                    <PreviewValue>{formData.tipoTratamiento}</PreviewValue>
                  </PreviewItem>
                  <PreviewItem>
                    <PreviewLabel>Producto</PreviewLabel>
                    <PreviewValue>{formData.producto}</PreviewValue>
                  </PreviewItem>
                  <PreviewItem>
                    <PreviewLabel>Dosis</PreviewLabel>
                    <PreviewValue>{formData.dosis} L/ha</PreviewValue>
                  </PreviewItem>
                  <PreviewItem>
                    <PreviewLabel>Hectáreas</PreviewLabel>
                    <PreviewValue>{formData.hectareas} ha</PreviewValue>
                  </PreviewItem>
                  <PreviewItem>
                    <PreviewLabel>Costo</PreviewLabel>
                    <PreviewValue>
                      {formatCurrency(formData.costo)}
                    </PreviewValue>
                  </PreviewItem>
                  <PreviewItem>
                    <PreviewLabel>Fecha Planificada</PreviewLabel>
                    <PreviewValue>
                      {formatDate(formData.fechaPlanificada)}
                    </PreviewValue>
                  </PreviewItem>
                </PreviewGrid>
              </PreviewSection>
            )}

            <FormActions>
              <SecondaryButton
                type="button"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <FaEyeSlash /> : <FaEye />}
                {showPreview ? 'Ocultar Vista Previa' : 'Vista Previa'}
              </SecondaryButton>

              <SecondaryButton type="button" onClick={onCancel}>
                <FaTimes />
                Cancelar
              </SecondaryButton>

              <PrimaryButton type="submit" disabled={isLoading}>
                <FaSave />
                {isLoading
                  ? 'Guardando...'
                  : isEdit
                    ? 'Actualizar'
                    : 'Guardar'}{' '}
                Fumigación
              </PrimaryButton>
            </FormActions>
          </form>
        </FormBody>
      </FormCard>
    </FormContainer>
  );
};

FumigacionForm.propTypes = {
  fumigacion: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
};

export default FumigacionForm;
