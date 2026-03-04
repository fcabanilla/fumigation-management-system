import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useLotes } from '../hooks/useLotes';
import LotePreview from './LotePreview';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaClock,
} from 'react-icons/fa';
import { GiSpray } from 'react-icons/gi';

// Styled Components
const FumigacionesContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 100%);
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  color: #2d5016;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.8rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a7c59;
  }

  &::placeholder {
    color: #999;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  min-width: 150px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a7c59;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  color: #4a7c59;
  border: 2px solid #4a7c59;

  &:hover:not(:disabled) {
    background: #4a7c59;
    color: white;
  }
`;

const IconButton = styled(Button)`
  padding: 0.5rem;
  min-width: auto;
  border-radius: 50%;

  &.edit {
    background: #2196f3;
    color: white;
  }

  &.delete {
    background: #f44336;
    color: white;
  }

  &.view {
    background: #ff9800;
    color: white;
  }
`;

const FumigacionesGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FumigacionCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-left: 5px solid ${(props) => props.statusColor || '#4a7c59'};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  color: #2d5016;
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.3;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(props) => props.background || '#e0e0e0'};
  color: ${(props) => props.color || '#666'};
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const InfoIcon = styled.div`
  color: #4a7c59;
  min-width: 16px;
  display: flex;
  align-items: center;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: flex-end;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  color: #666;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
`;

const EmptyDescription = styled.p`
  color: #999;
  margin: 0 0 2rem 0;
  line-height: 1.6;
`;

// Estados y colores de fumigación
const ESTADOS_FUMIGACION = {
  PLANIFICADA: {
    label: 'Planificada',
    color: '#fff',
    background: '#2196f3',
    statusColor: '#2196f3',
  },
  EN_PROCESO: {
    label: 'En Proceso',
    color: '#fff',
    background: '#ff9800',
    statusColor: '#ff9800',
  },
  COMPLETADA: {
    label: 'Completada',
    color: '#fff',
    background: '#4caf50',
    statusColor: '#4caf50',
  },
  CANCELADA: {
    label: 'Cancelada',
    color: '#fff',
    background: '#f44336',
    statusColor: '#f44336',
  },
};

// Función para obtener fumigaciones desde localStorage
const getFumigaciones = () => {
  try {
    const fumigaciones = localStorage.getItem('fumigaciones');
    return fumigaciones ? JSON.parse(fumigaciones) : [];
  } catch {
    return [];
  }
};

// Función para guardar fumigaciones en localStorage
const saveFumigaciones = (fumigaciones) => {
  try {
    localStorage.setItem('fumigaciones', JSON.stringify(fumigaciones));
  } catch {
    // Error al guardar - continuar silenciosamente
  }
};

// Datos de ejemplo para demostración
const fumigacionesEjemplo = [
  {
    id: '1',
    nombre: 'Tratamiento Preventivo Campo Norte',
    campo: 'Campo Norte - Lote A',
    tipoTratamiento: 'Preventivo',
    producto: 'Insecticida Organofosforado',
    dosis: 2.5,
    fechaPlanificada: '2025-10-15',
    fechaRealizada: null,
    estado: 'PLANIFICADA',
    hectareas: 45.5,
    costo: 12500,
    responsable: 'Juan Pérez',
    equipoUtilizado: 'Pulverizador Autopropulsado',
    observaciones: 'Aplicar en horas de baja temperatura, evitar viento.',
    createdAt: '2025-09-27T10:30:00',
    updatedAt: '2025-09-27T10:30:00',
  },
  {
    id: '2',
    nombre: 'Control de Plagas Campo Sur',
    campo: 'Campo Sur - Lote B',
    tipoTratamiento: 'Correctivo',
    producto: 'Fungicida Sistémico',
    dosis: 1.8,
    fechaPlanificada: '2025-09-30',
    fechaRealizada: '2025-09-30',
    estado: 'COMPLETADA',
    hectareas: 32.0,
    costo: 8900,
    responsable: 'María González',
    equipoUtilizado: 'Pulverizador de Arrastre',
    observaciones:
      'Aplicación completada exitosamente. Resultado satisfactorio.',
    createdAt: '2025-09-20T14:15:00',
    updatedAt: '2025-09-30T16:45:00',
  },
  {
    id: '3',
    nombre: 'Fumigación Aérea Cultivo Soja',
    campo: 'Campo Centro - Multiple',
    tipoTratamiento: 'Masivo',
    producto: 'Herbicida Post-emergente',
    dosis: 3.2,
    fechaPlanificada: '2025-10-01',
    fechaRealizada: null,
    estado: 'EN_PROCESO',
    hectareas: 125.0,
    costo: 35600,
    responsable: 'Carlos Rodriguez',
    equipoUtilizado: 'Avión Fumigador',
    observaciones: 'Coordinación con torre de control completada.',
    createdAt: '2025-09-25T09:00:00',
    updatedAt: '2025-10-01T08:00:00',
  },
];

const FumigacionesList = ({ onEdit, onView, onDelete, onNew }) => {
  const [fumigaciones, setFumigaciones] = useState([]);
  const [filteredFumigaciones, setFilteredFumigaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [isLoading, setIsLoading] = useState(true);
  const { lotes } = useLotes();

  // Función para encontrar lote por nombre de campo
  const findLoteByNombre = (nombreCampo) => {
    return lotes.find(
      (lote) =>
        lote.nombre.toLowerCase() === nombreCampo.toLowerCase() ||
        lote.nombre.toLowerCase().includes(nombreCampo.toLowerCase())
    );
  };

  // Cargar fumigaciones al montar el componente
  useEffect(() => {
    const loadFumigaciones = () => {
      setIsLoading(true);
      let fumigacionesData = getFumigaciones();

      // Si no hay datos, usar ejemplos
      if (fumigacionesData.length === 0) {
        fumigacionesData = fumigacionesEjemplo;
        saveFumigaciones(fumigacionesData);
      }

      setFumigaciones(fumigacionesData);
      setFilteredFumigaciones(fumigacionesData);
      setIsLoading(false);
    };

    loadFumigaciones();
  }, []);

  // Filtrar fumigaciones
  useEffect(() => {
    let filtered = fumigaciones;

    // Filtro por texto de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (fumigacion) =>
          fumigacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fumigacion.campo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fumigacion.producto
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          fumigacion.responsable
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (statusFilter !== 'TODOS') {
      filtered = filtered.filter(
        (fumigacion) => fumigacion.estado === statusFilter
      );
    }

    setFilteredFumigaciones(filtered);
  }, [fumigaciones, searchTerm, statusFilter]);

  const handleDelete = (id) => {
    // Usar confirm personalizado para evitar ESLint error
    // Confirmación para eliminar fumigación
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (confirm('¿Estás seguro de que deseas eliminar esta fumigación?')) {
      const updatedFumigaciones = fumigaciones.filter((f) => f.id !== id);
      setFumigaciones(updatedFumigaciones);
      saveFumigaciones(updatedFumigaciones);
      if (onDelete) {
        onDelete(id);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'No definida';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <FumigacionesContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <GiSpray style={{ fontSize: '3rem', color: '#4a7c59' }} />
          <p>Cargando fumigaciones...</p>
        </div>
      </FumigacionesContainer>
    );
  }

  return (
    <FumigacionesContainer>
      <Header>
        <Title>
          <GiSpray />
          Gestión de Fumigaciones
        </Title>
        <Actions>
          <PrimaryButton onClick={onNew}>
            <FaPlus />
            Nueva Fumigación
          </PrimaryButton>
        </Actions>
      </Header>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Buscar por nombre, campo, producto o responsable..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="TODOS">Todos los estados</option>
          {Object.entries(ESTADOS_FUMIGACION).map(([key, estado]) => (
            <option key={key} value={key}>
              {estado.label}
            </option>
          ))}
        </FilterSelect>
        <SecondaryButton>
          <FaFilter />
          Filtros
        </SecondaryButton>
      </SearchContainer>

      <FumigacionesGrid>
        {filteredFumigaciones.length > 0 ? (
          filteredFumigaciones.map((fumigacion) => {
            const estado = ESTADOS_FUMIGACION[fumigacion.estado];
            return (
              <FumigacionCard
                key={fumigacion.id}
                statusColor={estado.statusColor}
              >
                <CardHeader>
                  <CardTitle>{fumigacion.nombre}</CardTitle>
                  <StatusBadge
                    background={estado.background}
                    color={estado.color}
                  >
                    {estado.label}
                  </StatusBadge>
                </CardHeader>

                <CardContent>
                  {/* Preview del Lote */}
                  {findLoteByNombre(fumigacion.campo) ? (
                    <LotePreview
                      lote={findLoteByNombre(fumigacion.campo)}
                      compact={true}
                      showMap={false}
                    />
                  ) : (
                    <InfoRow>
                      <InfoIcon>🌾</InfoIcon>
                      <span>{fumigacion.campo} (lote no encontrado)</span>
                    </InfoRow>
                  )}

                  <InfoRow>
                    <InfoIcon>💊</InfoIcon>
                    <span>
                      {fumigacion.producto} ({fumigacion.dosis}L/ha)
                    </span>
                  </InfoRow>

                  <InfoRow>
                    <InfoIcon>
                      <FaClock />
                    </InfoIcon>
                    <span>
                      Planificada: {formatDate(fumigacion.fechaPlanificada)}
                    </span>
                  </InfoRow>

                  <InfoRow>
                    <InfoIcon>📏</InfoIcon>
                    <span>
                      {fumigacion.hectareas} ha -{' '}
                      {formatCurrency(fumigacion.costo)}
                    </span>
                  </InfoRow>

                  <InfoRow>
                    <InfoIcon>👨‍🌾</InfoIcon>
                    <span>{fumigacion.responsable}</span>
                  </InfoRow>
                </CardContent>

                <CardActions>
                  <IconButton
                    className="view"
                    onClick={() => onView && onView(fumigacion)}
                    title="Ver detalles"
                  >
                    <FaEye />
                  </IconButton>
                  <IconButton
                    className="edit"
                    onClick={() => onEdit && onEdit(fumigacion)}
                    title="Editar"
                  >
                    <FaEdit />
                  </IconButton>
                  <IconButton
                    className="delete"
                    onClick={() => handleDelete(fumigacion.id)}
                    title="Eliminar"
                  >
                    <FaTrash />
                  </IconButton>
                </CardActions>
              </FumigacionCard>
            );
          })
        ) : (
          <EmptyState>
            <EmptyIcon>
              <GiSpray />
            </EmptyIcon>
            <EmptyTitle>
              {searchTerm || statusFilter !== 'TODOS'
                ? 'No se encontraron fumigaciones'
                : 'No hay fumigaciones registradas'}
            </EmptyTitle>
            <EmptyDescription>
              {searchTerm || statusFilter !== 'TODOS'
                ? 'Intenta modificar los filtros de búsqueda para encontrar lo que buscas.'
                : 'Comienza creando tu primera fumigación para gestionar tus tratamientos agrícolas.'}
            </EmptyDescription>
            {!searchTerm && statusFilter === 'TODOS' && (
              <PrimaryButton onClick={onNew}>
                <FaPlus />
                Crear Primera Fumigación
              </PrimaryButton>
            )}
          </EmptyState>
        )}
      </FumigacionesGrid>
    </FumigacionesContainer>
  );
};

FumigacionesList.propTypes = {
  onEdit: PropTypes.func,
  onView: PropTypes.func,
  onDelete: PropTypes.func,
  onNew: PropTypes.func,
};

export default FumigacionesList;
