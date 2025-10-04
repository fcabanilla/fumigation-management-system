import React, { useState } from 'react';
import styled from 'styled-components';

// ==================== INTERFACES & TYPES ====================

/** Estados de vista del EntityManager */
const VIEWS = {
  LIST: 'list',
  FORM: 'form',
  VIEW: 'view',
  MAP: 'map',
} as const;

type EntityView = (typeof VIEWS)[keyof typeof VIEWS];

/** Configuración de entidad genérica */
interface EntityConfig {
  /** Nombre singular de la entidad (ej: 'Fumigación', 'Lote') */
  name: string;
  /** Nombre plural de la entidad (ej: 'Fumigaciones', 'Lotes') */
  namePlural: string;
  /** Icono de la entidad como string emoji */
  icon: string;
  /** Si mostrar vista de mapa */
  showMapView?: boolean;
  /** Género para generar texto correcto */
  gender?: 'masculine' | 'feminine';
}

/** Entidad base que debe tener toda entidad manejada */
interface BaseEntity {
  id: string | number;
  [key: string]: any;
}

/** Props de componentes CRUD genéricos - Flexibles */
interface EntityComponentProps<T = any> {
  // Props genéricas que pueden tener cualquier nombre
  [key: string]: any;
}

/** Props del EntityManager */
interface EntityManagerProps<T = any> {
  // Configuración de la entidad
  entityConfig: EntityConfig;

  // Componentes específicos de la entidad (sin restricciones de tipos)
  ListComponent: React.ComponentType<any>;
  FormComponent: React.ComponentType<any>;
  ViewComponent: React.ComponentType<any>;
  MapComponent?: React.ComponentType<any>;

  // Datos y estado
  data?: T[];
  isLoading?: boolean;

  // Operaciones CRUD - Flexibles
  onCreateEntity: (...args: any[]) => any;
  onUpdateEntity: (...args: any[]) => any;
  onDeleteEntity: (...args: any[]) => any;

  // Navegación
  onBack?: () => void;
}

// ==================== STYLED COMPONENTS ====================

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 100%);
  padding: 2rem;
`;

const Header = styled.div`
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
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{
  variant?: 'primary' | 'secondary' | 'danger';
}>`
  background: ${props => {
    switch (props.variant) {
      case 'primary':
        return '#28a745';
      case 'danger':
        return '#dc3545';
      case 'secondary':
      default:
        return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'primary':
          return '#218838';
        case 'danger':
          return '#c82333';
        case 'secondary':
        default:
          return 'rgba(255, 255, 255, 0.3)';
      }
    }};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 300px);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #6c757d;
`;

// ==================== HOOK PERSONALIZADO ====================

/**
 * Hook para manejar el estado del EntityManager
 */
const useEntityManager = () => {
  const [currentView, setCurrentView] = useState<EntityView>(VIEWS.LIST);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleViewEntity = (entity: any) => {
    setSelectedEntity(entity);
    setCurrentView(VIEWS.VIEW);
    setIsEditing(false);
  };

  const handleEditEntity = (entity: any) => {
    setSelectedEntity(entity);
    setCurrentView(VIEWS.FORM);
    setIsEditing(true);
  };

  const handleNewEntity = () => {
    setSelectedEntity(null);
    setCurrentView(VIEWS.FORM);
    setIsEditing(false);
  };

  const handleShowMap = () => {
    setCurrentView(VIEWS.MAP);
  };

  const handleBackToList = () => {
    setCurrentView(VIEWS.LIST);
    setSelectedEntity(null);
    setIsEditing(false);
  };

  const handleBack = () => {
    if (currentView === VIEWS.LIST) {
      return false; // Indica que debe manejar el onBack externo
    } else {
      handleBackToList();
      return true; // Indica que manejó la navegación internamente
    }
  };

  return {
    currentView,
    selectedEntity,
    isEditing,
    handleViewEntity,
    handleEditEntity,
    handleNewEntity,
    handleShowMap,
    handleBackToList,
    handleBack,
  };
};

// ==================== COMPONENTE PRINCIPAL ====================

/**
 * EntityManager - Componente genérico para gestión CRUD de entidades
 *
 * Proporciona una interfaz consistente para:
 * - Listado de entidades
 * - Creación/edición con formularios
 * - Vista detallada de entidades individuales
 * - Vista de mapa (opcional)
 *
 * @template T Tipo de entidad que extiende BaseEntity
 */
const EntityManager = ({
  entityConfig,
  ListComponent,
  FormComponent,
  ViewComponent,
  MapComponent,
  data = [],
  isLoading = false,
  onCreateEntity,
  onUpdateEntity,
  onDeleteEntity,
  onBack,
}: EntityManagerProps): React.ReactElement => {
  const {
    currentView,
    selectedEntity,
    isEditing,
    handleViewEntity,
    handleEditEntity,
    handleNewEntity,
    handleShowMap,
    handleBackToList,
    handleBack,
  } = useEntityManager();

  /**
   * Maneja el guardado de entidades (crear o actualizar)
   */
  const handleSaveEntity = async (entityData: any) => {
    try {
      if (isEditing && 'id' in entityData) {
        await onUpdateEntity(entityData);
      } else {
        await onCreateEntity(entityData);
      }
      handleBackToList();
    } catch (error) {
      console.error('Error saving entity:', error);
      // Aquí podrías manejar errores específicos
    }
  };

  /**
   * Maneja la eliminación de entidades
   */
  const handleDeleteEntity = async (entity: any) => {
    try {
      await onDeleteEntity(entity.id);
      handleBackToList();
    } catch (error) {
      console.error('Error deleting entity:', error);
      // Aquí podrías manejar errores específicos
    }
  };

  /**
   * Maneja la navegación hacia atrás
   */
  const handleBackNavigation = () => {
    const handled = handleBack();
    if (!handled && onBack) {
      onBack();
    }
  };

  /**
   * Obtiene el título de la página según la vista actual
   */
  const getPageTitle = (): string => {
    switch (currentView) {
      case VIEWS.LIST:
        return `Gestión de ${entityConfig.namePlural}`;
      case VIEWS.FORM:
        return isEditing
          ? `Editar ${entityConfig.name}`
          : `Nuev${entityConfig.gender === 'feminine' ? 'a' : 'o'} ${entityConfig.name}`;
      case VIEWS.VIEW:
        return `${entityConfig.name}: ${selectedEntity?.nombre || selectedEntity?.name || 'Detalle'}`;
      case VIEWS.MAP:
        return `Mapa de ${entityConfig.namePlural}`;
      default:
        return entityConfig.namePlural;
    }
  };

  /**
   * Renderiza el contenido según la vista actual
   */
  const renderContent = (): React.ReactElement | null => {
    if (isLoading) {
      return (
        <LoadingContainer>
          ⏳ Cargando {entityConfig.namePlural.toLowerCase()}...
        </LoadingContainer>
      );
    }

    const commonProps: any = {
      entities: data,
      onEdit: handleEditEntity,
      onDelete: handleDeleteEntity,
      onBack: handleBackToList,
    };

    switch (currentView) {
      case VIEWS.LIST:
        return <ListComponent {...commonProps} onView={handleViewEntity} />;

      case VIEWS.FORM:
        return (
          <FormComponent
            {...commonProps}
            entity={selectedEntity || undefined}
            onSave={handleSaveEntity}
            isEditing={isEditing}
          />
        );

      case VIEWS.VIEW:
        if (!selectedEntity) {
          return (
            <LoadingContainer>
              ❌ No se encontró {entityConfig.name.toLowerCase()}
            </LoadingContainer>
          );
        }
        return <ViewComponent {...commonProps} entity={selectedEntity} />;

      case VIEWS.MAP:
        if (!MapComponent) {
          return (
            <LoadingContainer>🗺️ Vista de mapa no disponible</LoadingContainer>
          );
        }
        return <MapComponent {...commonProps} entities={data} />;

      default:
        return null;
    }
  };

  return (
    <Container>
      {/* Header con navegación y acciones */}
      <Header>
        <HeaderContent>
          <Title>
            {entityConfig.icon}
            {getPageTitle()}
          </Title>

          <ButtonGroup>
            <ActionButton variant="secondary" onClick={handleBackNavigation}>
              ⬅️
              {currentView === VIEWS.LIST ? 'Volver' : 'Atrás'}
            </ActionButton>

            {currentView === VIEWS.LIST && (
              <>
                <ActionButton variant="primary" onClick={handleNewEntity}>
                  ➕ Nuev{entityConfig.gender === 'feminine' ? 'a' : 'o'}{' '}
                  {entityConfig.name}
                </ActionButton>

                {entityConfig.showMapView && MapComponent && (
                  <ActionButton variant="secondary" onClick={handleShowMap}>
                    🗺️ Ver Mapa
                  </ActionButton>
                )}
              </>
            )}

            {currentView === VIEWS.VIEW && selectedEntity && (
              <ActionButton
                variant="primary"
                onClick={() => handleEditEntity(selectedEntity)}
              >
                ✏️ Editar
              </ActionButton>
            )}
          </ButtonGroup>
        </HeaderContent>
      </Header>

      <ContentArea>{renderContent()}</ContentArea>
    </Container>
  );
};

// ==================== EXPORTS ====================

export default EntityManager;
export { VIEWS };
export type {
  EntityManagerProps,
  EntityConfig,
  BaseEntity,
  EntityComponentProps,
  EntityView,
};
