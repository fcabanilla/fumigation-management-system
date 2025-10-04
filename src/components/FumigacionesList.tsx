import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaFilter,
  FaSort,
} from 'react-icons/fa';
import { GiSpray } from 'react-icons/gi';
import EstadoWorkflow from './EstadoWorkflow';
import { FumigacionEstado } from '../utils/FumigacionStateMachine';

// ==================== TYPE FIXES ====================

// Fix para react-icons
const SprayIcon = GiSpray as React.ComponentType<{
  size?: number;
  color?: string;
}>;
const SearchIcon = FaSearch as React.ComponentType<{ size?: number }>;
const EditIcon = FaEdit as React.ComponentType<{ size?: number }>;
const TrashIcon = FaTrash as React.ComponentType<{ size?: number }>;
const EyeIcon = FaEye as React.ComponentType<{ size?: number }>;
const PlusIcon = FaPlus as React.ComponentType<{ size?: number }>;
const FilterIcon = FaFilter as React.ComponentType<{
  style?: React.CSSProperties;
}>;

// ==================== INTERFACES ====================

export interface Fumigacion {
  id: string;
  nombre: string;
  campo: string;
  tipoTratamiento: string;
  producto: string;
  dosis: number;
  fechaPlanificada: string;
  fechaRealizada?: string;
  estado: 'Planificada' | 'En Proceso' | 'Completada' | 'Cancelada';
  hectareas: number;
  costo: number;
  responsable: string;
  equipoUtilizado?: string;
  condicionesClimaticas?: {
    temperatura: number;
    humedad: number;
    viento: number;
  };
  observaciones?: string;
  resultados?: {
    efectividad: number;
    plagas_controladas: string[];
  };
  createdAt: string;
  updatedAt: string;
  geometry?: any; // GeoJSON geometry
}

export interface FumigacionFilters {
  estado?: string;
  campo?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  responsable?: string;
}

export interface FumigacionesListProps {
  onEdit?: (fumigacion: Fumigacion) => void;
  onDelete?: (id: string) => void;
  onView?: (fumigacion: Fumigacion) => void;
  onAdd?: () => void;
  onEstadoChange?: (
    fumigacion: Fumigacion,
    nuevoEstado: FumigacionEstado
  ) => Promise<void>;
}

// ==================== STYLED COMPONENTS ====================

const Container = styled.div`
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 15px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border: 2px solid #e1e8ed;
  border-radius: 25px;
  outline: none;
  width: 300px;
  min-width: 200px;

  &:focus {
    border-color: #4a7c59;
    box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  background: ${props =>
    props.variant === 'danger'
      ? '#e74c3c'
      : props.variant === 'secondary'
        ? '#6c757d'
        : '#4a7c59'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props =>
      props.variant === 'danger'
        ? '#c0392b'
        : props.variant === 'secondary'
          ? '#5a6268'
          : '#2d5016'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  outline: none;
  background: white;

  &:focus {
    border-color: #4a7c59;
  }
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  outline: none;

  &:focus {
    border-color: #4a7c59;
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 150px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const StatusContainer = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
`;

const CardTitle = styled.h3`
  margin: 0 80px 15px 0;
  color: #2c3e50;
  font-size: 1.2rem;
`;

const CardDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
`;

const DetailItem = styled.div`
  font-size: 0.9rem;

  strong {
    color: #2c3e50;
  }

  span {
    color: #7f8c8d;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
`;

const ActionButton = styled.button<{ variant?: 'view' | 'edit' | 'delete' }>`
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: ${props => {
    switch (props.variant) {
      case 'view':
        return '#3498db';
      case 'edit':
        return '#f39c12';
      case 'delete':
        return '#e74c3c';
      default:
        return '#6c757d';
    }
  }};

  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2em;
  color: #7f8c8d;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 2px solid ${props => (props.active ? '#4a7c59' : '#e1e8ed')};
  background: ${props => (props.active ? '#4a7c59' : 'white')};
  color: ${props => (props.active ? 'white' : '#2c3e50')};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #4a7c59;
    background: ${props => (props.active ? '#4a7c59' : '#f8f9fa')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CreateButton = styled(Button)`
  margin-top: 20px;
`;

const LoadingText = styled.span`
  margin-left: 10px;
`;

// ==================== MOCK API ====================

const mockFumigaciones: Fumigacion[] = [
  {
    id: '1',
    nombre: 'Fumigación Campo Norte',
    campo: 'Campo Norte - Lote 1',
    tipoTratamiento: 'Preventivo',
    producto: 'Cipermetrina 25%',
    dosis: 2.5,
    fechaPlanificada: '2025-10-01',
    estado: 'Planificada',
    hectareas: 15.5,
    costo: 85000,
    responsable: 'Juan Pérez',
    equipoUtilizado: 'Pulverizador John Deere',
    condicionesClimaticas: {
      temperatura: 22,
      humedad: 65,
      viento: 8,
    },
    observaciones: 'Aplicar temprano en la mañana',
    createdAt: '2025-09-28T10:00:00Z',
    updatedAt: '2025-09-28T10:00:00Z',
  },
  {
    id: '2',
    nombre: 'Control de Plagas Sur',
    campo: 'Campo Sur - Lote 3',
    tipoTratamiento: 'Correctivo',
    producto: 'Deltametrina 2.5%',
    dosis: 1.8,
    fechaPlanificada: '2025-09-25',
    fechaRealizada: '2025-09-25',
    estado: 'Completada',
    hectareas: 22.3,
    costo: 125000,
    responsable: 'María García',
    equipoUtilizado: 'Pulverizador Jacto',
    resultados: {
      efectividad: 95,
      plagas_controladas: ['Pulgón', 'Trips'],
    },
    observaciones: 'Excelentes resultados',
    createdAt: '2025-09-20T08:30:00Z',
    updatedAt: '2025-09-25T16:45:00Z',
  },
  {
    id: '3',
    nombre: 'Tratamiento Orgánico Este',
    campo: 'Campo Este - Lote 2',
    tipoTratamiento: 'Orgánico',
    producto: 'Bacillus thuringiensis',
    dosis: 3.0,
    fechaPlanificada: '2025-09-30',
    estado: 'En Proceso',
    hectareas: 18.7,
    costo: 95000,
    responsable: 'Carlos López',
    equipoUtilizado: 'Pulverizador Manual',
    observaciones: 'Aplicación orgánica certificada',
    createdAt: '2025-09-25T14:20:00Z',
    updatedAt: '2025-09-28T09:15:00Z',
  },
];

const mockFetchFumigaciones = async (
  filters?: FumigacionFilters,
  page = 1,
  limit = 10
): Promise<{
  data: Fumigacion[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredData = [...mockFumigaciones];

  // Aplicar filtros
  if (filters?.estado) {
    filteredData = filteredData.filter(f => f.estado === filters.estado);
  }
  if (filters?.campo) {
    filteredData = filteredData.filter(f =>
      f.campo.toLowerCase().includes(filters.campo!.toLowerCase())
    );
  }
  if (filters?.responsable) {
    filteredData = filteredData.filter(f =>
      f.responsable.toLowerCase().includes(filters.responsable!.toLowerCase())
    );
  }

  // Paginación
  const total = filteredData.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total,
    page,
    totalPages,
  };
};

// ==================== MAIN COMPONENT ====================

const FumigacionesList: React.FC<FumigacionesListProps> = ({
  onEdit,
  onDelete,
  onView,
  onAdd,
  onEstadoChange,
}) => {
  // Estados
  const [fumigaciones, setFumigaciones] = useState<Fumigacion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<FumigacionFilters>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);

  // Cargar fumigaciones
  useEffect(() => {
    const loadFumigaciones = async () => {
      setIsLoading(true);
      try {
        const result = await mockFetchFumigaciones(
          filters,
          currentPage,
          itemsPerPage
        );
        setFumigaciones(result.data);
      } catch (error) {
        console.error('Error cargando fumigaciones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFumigaciones();
  }, [filters, currentPage, itemsPerPage]);

  // Filtrado por búsqueda
  const filteredFumigaciones = useMemo(() => {
    if (!searchTerm) return fumigaciones;

    return fumigaciones.filter(
      f =>
        f.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.campo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.producto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.responsable?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [fumigaciones, searchTerm]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = mockFumigaciones.length;
    const completadas = mockFumigaciones.filter(
      f => f.estado === 'Completada'
    ).length;
    const enProceso = mockFumigaciones.filter(
      f => f.estado === 'En Proceso'
    ).length;
    const planificadas = mockFumigaciones.filter(
      f => f.estado === 'Planificada'
    ).length;

    return { total, completadas, enProceso, planificadas };
  }, []);

  // Handlers
  const handleFilterChange = (key: keyof FumigacionFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm('¿Estás seguro de que deseas eliminar esta fumigación?')
    ) {
      // Aquí iría la llamada a la API para eliminar
      console.log('Eliminando fumigación:', id);
      if (onDelete) {
        onDelete(id);
      }
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Container>
        <LoadingState>
          <SprayIcon size={30} />
          <LoadingText>Cargando fumigaciones...</LoadingText>
        </LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>
          <SprayIcon size={30} />
          Gestión de Fumigaciones
        </Title>

        <Controls>
          <SearchInput
            type="text"
            placeholder="Buscar por nombre, campo, producto..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {onAdd && (
            <Button onClick={onAdd}>
              <PlusIcon /> Nueva Fumigación
            </Button>
          )}
        </Controls>
      </Header>

      {/* Estadísticas */}
      <StatsBar>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.planificadas}</StatValue>
          <StatLabel>Planificadas</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.enProceso}</StatValue>
          <StatLabel>En Proceso</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.completadas}</StatValue>
          <StatLabel>Completadas</StatLabel>
        </StatCard>
      </StatsBar>

      {/* Filtros */}
      <FilterBar>
        <FilterIcon style={{ color: '#7f8c8d' }} />
        <FilterSelect
          aria-label="Filtrar por estado"
          value={filters.estado || ''}
          onChange={e => handleFilterChange('estado', e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Planificada">Planificada</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Completada">Completada</option>
          <option value="Cancelada">Cancelada</option>
        </FilterSelect>

        <FilterInput
          type="text"
          aria-label="Filtrar por campo"
          placeholder="Filtrar por campo..."
          value={filters.campo || ''}
          onChange={e => handleFilterChange('campo', e.target.value)}
        />

        <FilterInput
          type="text"
          aria-label="Filtrar por responsable"
          placeholder="Filtrar por responsable..."
          value={filters.responsable || ''}
          onChange={e => handleFilterChange('responsable', e.target.value)}
        />

        {Object.keys(filters).length > 0 && (
          <Button
            variant="secondary"
            onClick={() => {
              setFilters({});
              setCurrentPage(1);
            }}
          >
            Limpiar Filtros
          </Button>
        )}
      </FilterBar>

      {/* Lista de fumigaciones */}
      {filteredFumigaciones.length === 0 ? (
        <EmptyState>
          <SprayIcon size={80} color="#bdc3c7" />
          <h3>No hay fumigaciones</h3>
          <p>
            {searchTerm || Object.keys(filters).length > 0
              ? 'No hay resultados para los filtros aplicados'
              : 'Aún no hay fumigaciones registradas. ¡Crea la primera!'}
          </p>
          {onAdd && !searchTerm && Object.keys(filters).length === 0 && (
            <CreateButton onClick={onAdd}>
              <PlusIcon /> Crear Primera Fumigación
            </CreateButton>
          )}
        </EmptyState>
      ) : (
        <>
          <Grid>
            {filteredFumigaciones.map(fumigacion => (
              <Card key={fumigacion.id}>
                <StatusContainer>
                  <EstadoWorkflow
                    fumigacion={fumigacion}
                    onEstadoChange={onEstadoChange}
                    mostrarHistorial={true}
                  />
                </StatusContainer>

                <CardTitle>{fumigacion.nombre}</CardTitle>

                <CardDetails>
                  <DetailItem>
                    <strong>Campo:</strong>
                    <br />
                    <span>{fumigacion.campo}</span>
                  </DetailItem>
                  <DetailItem>
                    <strong>Producto:</strong>
                    <br />
                    <span>{fumigacion.producto}</span>
                  </DetailItem>
                  <DetailItem>
                    <strong>Hectáreas:</strong>
                    <br />
                    <span>{fumigacion.hectareas} ha</span>
                  </DetailItem>
                  <DetailItem>
                    <strong>Costo:</strong>
                    <br />
                    <span>${fumigacion.costo.toLocaleString()}</span>
                  </DetailItem>
                  <DetailItem>
                    <strong>Responsable:</strong>
                    <br />
                    <span>{fumigacion.responsable}</span>
                  </DetailItem>
                  <DetailItem>
                    <strong>Fecha:</strong>
                    <br />
                    <span>
                      {new Date(fumigacion.fechaPlanificada).toLocaleDateString(
                        'es-ES'
                      )}
                    </span>
                  </DetailItem>
                </CardDetails>

                <ActionButtons>
                  {onView && (
                    <ActionButton
                      variant="view"
                      onClick={() => onView(fumigacion)}
                    >
                      <EyeIcon /> Ver
                    </ActionButton>
                  )}
                  {onEdit && (
                    <ActionButton
                      variant="edit"
                      onClick={() => onEdit(fumigacion)}
                    >
                      <EditIcon /> Editar
                    </ActionButton>
                  )}
                  {onDelete && (
                    <ActionButton
                      variant="delete"
                      onClick={() => handleDelete(fumigacion.id)}
                    >
                      <TrashIcon /> Eliminar
                    </ActionButton>
                  )}
                </ActionButtons>
              </Card>
            ))}
          </Grid>

          {/* Paginación */}
          <Pagination>
            <PageButton
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Anterior
            </PageButton>
            <PageButton active>{currentPage}</PageButton>
            <PageButton onClick={() => setCurrentPage(prev => prev + 1)}>
              Siguiente
            </PageButton>
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default FumigacionesList;
