import React, { useState } from 'react';
import FumigacionesList from './FumigacionesList';
import FumigacionForm from './FumigacionForm';
import FumigacionView from './FumigacionView';
import { useFumigaciones } from '../hooks/useApi';
import { Fumigacion, FumigacionFormData, User } from '../types/index';

// ==================== INTERFACES ====================

/** Vistas disponibles en el gestor de fumigaciones */
type FumigacionView = 'list' | 'form' | 'view';

/** Props del componente FumigacionManager */
interface FumigacionManagerProps {
  /** Función callback para volver atrás */
  onBack?: () => void;
  /** Función callback para cerrar sesión */
  onLogout?: () => void;
  /** Usuario actual del sistema */
  user?: User;
}

// ==================== CONSTANTS ====================

/** Estados disponibles del componente */
const VIEWS: Record<string, FumigacionView> = {
  LIST: 'list',
  FORM: 'form',
  VIEW: 'view',
} as const;

// ==================== MAIN COMPONENT ====================

/**
 * Gestor principal de fumigaciones con navegación entre vistas
 *
 * @description
 * Componente que coordina la gestión completa de fumigaciones:
 * - Lista de fumigaciones existentes
 * - Formulario para crear/editar fumigaciones
 * - Vista detallada de fumigaciones individuales
 * - Operaciones CRUD completas
 *
 * @example
 * ```tsx
 * <FumigacionManager
 *   user={currentUser}
 *   onBack={() => navigate('/dashboard')}
 *   onLogout={() => authService.logout()}
 * />
 * ```
 */
const FumigacionManager: React.FC<FumigacionManagerProps> = ({
  onBack,
  onLogout,
  user,
}) => {
  // ==================== STATE ====================

  const [currentView, setCurrentView] = useState<FumigacionView>(VIEWS.LIST);
  const [selectedFumigacion, setSelectedFumigacion] =
    useState<Fumigacion | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Hook para operaciones de fumigaciones
  const {
    fumigaciones,
    isLoading,
    createFumigacion,
    updateFumigacion,
    deleteFumigacion,
  } = useFumigaciones();

  // ==================== EVENT HANDLERS ====================

  /**
   * Navega a la vista de creación de nueva fumigación
   */
  const handleNew = (): void => {
    setSelectedFumigacion(null);
    setIsEdit(false);
    setCurrentView(VIEWS.FORM);
  };

  /**
   * Navega a la vista de edición de fumigación existente
   * @param fumigacion - Fumigación a editar
   */
  const handleEdit = (fumigacion: Fumigacion): void => {
    setSelectedFumigacion(fumigacion);
    setIsEdit(true);
    setCurrentView(VIEWS.FORM);
  };

  /**
   * Navega a la vista detallada de una fumigación
   * @param fumigacion - Fumigación a visualizar
   */
  const handleView = (fumigacion: Fumigacion): void => {
    setSelectedFumigacion(fumigacion);
    setCurrentView(VIEWS.VIEW);
  };

  /**
   * Elimina una fumigación del sistema
   * @param fumigacionId - ID de la fumigación a eliminar
   */
  const handleDelete = async (fumigacionId: string): Promise<void> => {
    try {
      const result = await deleteFumigacion(fumigacionId);
      if (result?.success) {
        console.log('Fumigación eliminada exitosamente');
      } else {
        console.error('Error eliminando fumigación:', result?.error);
      }
    } catch (error) {
      console.error('Error eliminando fumigación:', error);
    }
  };

  /**
   * Guarda una fumigación (nueva o editada)
   * @param fumigacionData - Datos de la fumigación
   */
  const handleSave = async (
    fumigacionData: FumigacionFormData
  ): Promise<void> => {
    try {
      let result;

      if (isEdit && selectedFumigacion) {
        result = await updateFumigacion(selectedFumigacion.id, fumigacionData);
        if (result?.success) {
          console.log('Fumigación actualizada exitosamente');
        } else {
          console.error('Error actualizando fumigación:', result?.error);
          return;
        }
      } else {
        result = await createFumigacion(fumigacionData);
        if (result?.success) {
          console.log('Fumigación creada exitosamente');
        } else {
          console.error('Error creando fumigación:', result?.error);
          return;
        }
      }

      // Volver a la lista si fue exitoso
      setCurrentView(VIEWS.LIST);
      setSelectedFumigacion(null);
      setIsEdit(false);
    } catch (error) {
      console.error('Error guardando fumigación:', error);
    }
  };

  /**
   * Cancela la operación actual y vuelve a la lista
   */
  const handleCancel = (): void => {
    setCurrentView(VIEWS.LIST);
    setSelectedFumigacion(null);
    setIsEdit(false);
  };

  /**
   * Cierra la vista detallada y vuelve a la lista
   */
  const handleCloseView = (): void => {
    setCurrentView(VIEWS.LIST);
    setSelectedFumigacion(null);
  };

  // ==================== RENDER ====================

  // Renderizar vista según el estado actual
  switch (currentView) {
    case VIEWS.FORM:
      return (
        <FumigacionForm
          fumigacion={selectedFumigacion}
          isEdit={isEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      );

    case VIEWS.VIEW:
      return (
        <FumigacionView
          fumigacion={selectedFumigacion}
          onEdit={handleEdit}
          onClose={handleCloseView}
        />
      );

    case VIEWS.LIST:
    default:
      return (
        <FumigacionesList
          {...({
            fumigaciones: fumigaciones,
            isLoading: isLoading,
            onAdd: handleNew,
            onEdit: handleEdit,
            onView: handleView,
            onDelete: handleDelete,
          } as any)}
        />
      );
  }
};

export default FumigacionManager;
export type { FumigacionManagerProps, FumigacionView };
