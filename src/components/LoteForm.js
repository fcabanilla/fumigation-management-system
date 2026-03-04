import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MapaEditor from './MapaEditor';
import * as turf from '@turf/turf';
import { FaSave, FaTimes, FaMapMarkedAlt, FaCalculator } from 'react-icons/fa';
import { GiWheat } from 'react-icons/gi';

// Styled Components
const FormContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
`;

const SectionTitle = styled.h3`
  color: #4a7c59;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
`;

const RequiredMark = styled.span`
  color: #dc3545;
  margin-left: 0.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a7c59;
    box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.2);
  }

  &.error {
    border-color: #dc3545;
    background-color: #fff5f5;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a7c59;
    box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.2);
  }

  &.error {
    border-color: #dc3545;
    background-color: #fff5f5;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a7c59;
    box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.2);
  }
`;

const MapSection = styled.div`
  grid-column: 1 / -1;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a7c59;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
`;

const Button = styled.button`
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(Button)`
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 124, 89, 0.3);
  }
`;

const CancelButton = styled(Button)`
  background: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background: #545b62;
    transform: translateY(-2px);
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.3rem;
`;

const CULTIVOS_OPTIONS = [
  { value: '', label: 'Seleccionar cultivo' },
  { value: 'Soja', label: 'Soja' },
  { value: 'Maíz', label: 'Maíz' },
  { value: 'Trigo', label: 'Trigo' },
  { value: 'Girasol', label: 'Girasol' },
  { value: 'Sorgo', label: 'Sorgo' },
  { value: 'Avena', label: 'Avena' },
  { value: 'Cebada', label: 'Cebada' },
  { value: 'Otro', label: 'Otro' },
];

const LoteForm = ({ lote, isEditing, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    hectareas: '',
    cultivo: '',
    propietario: '',
    geometria: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Cargar datos del lote si estamos editando
  useEffect(() => {
    if (lote && isEditing) {
      setFormData({
        nombre: lote.nombre || '',
        descripcion: lote.descripcion || '',
        hectareas: lote.hectareas || '',
        cultivo: lote.cultivo || '',
        propietario: lote.propietario || '',
        geometria: lote.geometria || null,
      });
    }
  }, [lote, isEditing]);

  // Calcular estadísticas de la geometría
  const estadisticas = React.useMemo(() => {
    if (!formData.geometria || !formData.geometria.geometry) {
      return {
        area: 0,
        perimetro: 0,
        vertices: 0,
      };
    }

    const area = turf.area(formData.geometria) / 10000; // Convertir a hectáreas
    const perimetro = turf.length(formData.geometria, { units: 'kilometers' });
    const vertices = formData.geometria.geometry.coordinates[0].length - 1;

    return {
      area: Math.round(area * 100) / 100,
      perimetro: Math.round(perimetro * 100) / 100,
      vertices,
    };
  }, [formData.geometria]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error si existe
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleGeometriaChange = (geometry) => {
    setFormData((prev) => ({
      ...prev,
      geometria: geometry,
    }));

    // Calcular hectáreas automáticamente si la geometría es válida
    if (
      geometry &&
      geometry.geometry &&
      geometry.geometry.coordinates.length > 0
    ) {
      try {
        const area = turf.area(geometry);
        const areaHectares = (area / 10000).toFixed(2);
        setFormData((prev) => ({
          ...prev,
          hectareas: areaHectares,
        }));
      } catch (error) {
        // Error calculando área
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.propietario.trim()) {
      newErrors.propietario = 'El propietario es obligatorio';
    }

    if (!formData.hectareas || parseFloat(formData.hectareas) <= 0) {
      newErrors.hectareas = 'Las hectáreas deben ser mayores a 0';
    }

    if (!formData.cultivo) {
      newErrors.cultivo = 'Debe seleccionar un cultivo';
    }

    if (!formData.geometria) {
      newErrors.geometria = 'Debe dibujar la geometría del lote';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const loteData = {
        ...formData,
        hectareas: parseFloat(formData.hectareas),
        // Actualizar propiedades de la geometría
        geometria: {
          ...formData.geometria,
          properties: {
            ...formData.geometria.properties,
            nombre: formData.nombre,
            cultivo: formData.cultivo,
          },
        },
      };

      await onSave(loteData);
    } catch (error) {
      setErrors({ general: 'Error al guardar el lote' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          {/* Información Básica */}
          <FormSection>
            <SectionTitle>
              <GiWheat />
              Información Básica
            </SectionTitle>

            <FormGroup>
              <Label>
                Nombre del Lote <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={errors.nombre ? 'error' : ''}
                placeholder="Campo Norte Principal"
              />
              {errors.nombre && <ErrorMessage>{errors.nombre}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>Descripción</Label>
              <TextArea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción detallada del lote..."
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Cultivo <RequiredMark>*</RequiredMark>
              </Label>
              <Select
                name="cultivo"
                value={formData.cultivo}
                onChange={handleInputChange}
                className={errors.cultivo ? 'error' : ''}
              >
                {CULTIVOS_OPTIONS.map((cultivo) => (
                  <option key={cultivo.value} value={cultivo.value}>
                    {cultivo.label}
                  </option>
                ))}
              </Select>
              {errors.cultivo && <ErrorMessage>{errors.cultivo}</ErrorMessage>}
            </FormGroup>
          </FormSection>

          {/* Información de Propiedad */}
          <FormSection>
            <SectionTitle>
              <FaMapMarkedAlt />
              Información de Propiedad
            </SectionTitle>

            <FormGroup>
              <Label>
                Propietario <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="text"
                name="propietario"
                value={formData.propietario}
                onChange={handleInputChange}
                className={errors.propietario ? 'error' : ''}
                placeholder="Establecimiento San José"
              />
              {errors.propietario && (
                <ErrorMessage>{errors.propietario}</ErrorMessage>
              )}
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

            {/* Estadísticas en tiempo real */}
            {formData.geometria && (
              <StatsGrid>
                <StatItem>
                  <StatValue>
                    <FaCalculator /> {estadisticas.area}
                  </StatValue>
                  <StatLabel>Hectáreas Calculadas</StatLabel>
                </StatItem>

                <StatItem>
                  <StatValue>{estadisticas.perimetro}</StatValue>
                  <StatLabel>Perímetro (km)</StatLabel>
                </StatItem>

                <StatItem>
                  <StatValue>{estadisticas.vertices}</StatValue>
                  <StatLabel>Vértices</StatLabel>
                </StatItem>
              </StatsGrid>
            )}
          </FormSection>
        </FormGrid>

        {/* Mapa Editor */}
        <MapSection>
          <SectionTitle>
            <FaMapMarkedAlt />
            Geometría del Lote
            {!formData.geometria && <RequiredMark>*</RequiredMark>}
          </SectionTitle>

          <MapaEditor
            geometry={formData.geometria}
            onChange={handleGeometriaChange}
            height={400}
          />

          {errors.geometria && <ErrorMessage>{errors.geometria}</ErrorMessage>}
        </MapSection>

        {/* Botones de acción */}
        <ButtonGroup>
          <CancelButton type="button" onClick={onCancel}>
            <FaTimes />
            Cancelar
          </CancelButton>

          <SaveButton type="submit" disabled={loading}>
            <FaSave />
            {loading
              ? 'Guardando...'
              : isEditing
                ? 'Actualizar Lote'
                : 'Crear Lote'}
          </SaveButton>
        </ButtonGroup>

        {errors.general && (
          <ErrorMessage style={{ textAlign: 'center', marginTop: '1rem' }}>
            {errors.general}
          </ErrorMessage>
        )}
      </form>
    </FormContainer>
  );
};

LoteForm.propTypes = {
  lote: PropTypes.object,
  isEditing: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default LoteForm;
