import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FumigacionesList from './FumigacionesList';
import FumigacionForm from './FumigacionForm';
import FumigacionView from './FumigacionView';
import { useFumigaciones } from '../hooks/useApi';

// Estados del componente
const VIEWS = {
  LIST: 'list',
  FORM: 'form',
  VIEW: 'view',
};

// FumigacionManager ahora usa la arquitectura moderna con MSW + React Query pattern

const FumigacionManager = ({ onBack, onLogout, user }) => {
  const [currentView, setCurrentView] = useState(VIEWS.LIST);
  const [selectedFumigacion, setSelectedFumigacion] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Usar el hook moderno en lugar de localStorage
  const {
    fumigaciones,
    isLoading,
    loadFumigaciones,
    createFumigacion,
    updateFumigacion,
    deleteFumigacion,
  } = useFumigaciones();

  // Handlers para las diferentes acciones
  const handleNew = () => {
    setSelectedFumigacion(null);
    setIsEdit(false);
    setCurrentView(VIEWS.FORM);
  };

  const handleEdit = fumigacion => {
    setSelectedFumigacion(fumigacion);
    setIsEdit(true);
    setCurrentView(VIEWS.FORM);
  };

  const handleView = fumigacion => {
    setSelectedFumigacion(fumigacion);
    setCurrentView(VIEWS.VIEW);
  };

  const handleDelete = async fumigacionId => {
    try {
      const result = await deleteFumigacion(fumigacionId);
      if (result.success) {
        // La fumigación se elimina automáticamente del estado por el hook
        console.log('Fumigación eliminada exitosamente');
      } else {
        console.error('Error eliminando fumigación:', result.error);
        // TODO: Mostrar error al usuario
      }
    } catch (error) {
      console.error('Error eliminando fumigación:', error);
    }
  };

  const handleSave = async fumigacionData => {
    try {
      if (isEdit && selectedFumigacion) {
        // Actualizar fumigación existente usando la API
        const result = await updateFumigacion(
          selectedFumigacion.id,
          fumigacionData
        );
        if (result.success) {
          console.log('Fumigación actualizada exitosamente');
        } else {
          console.error('Error actualizando fumigación:', result.error);
          return; // No cerrar el formulario si hay error
        }
      } else {
        // Crear nueva fumigación usando la API
        const result = await createFumigacion(fumigacionData);
        if (result.success) {
          console.log('Fumigación creada exitosamente');
        } else {
          console.error('Error creando fumigación:', result.error);
          return; // No cerrar el formulario si hay error
        }
      }

      // Si llega aquí, la operación fue exitosa - volver a la lista
      setCurrentView(VIEWS.LIST);
      setSelectedFumigacion(null);
      setIsEdit(false);
    } catch (error) {
      console.error('Error guardando fumigación:', error);
      // TODO: Implementar error boundary o notificación
    }
  };

  const handleCancel = () => {
    setCurrentView(VIEWS.LIST);
    setSelectedFumigacion(null);
    setIsEdit(false);
  };

  const handleCloseView = () => {
    setCurrentView(VIEWS.LIST);
    setSelectedFumigacion(null);
  };

  // Render según la vista actual
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
          fumigaciones={fumigaciones}
          isLoading={isLoading}
          onNew={handleNew}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      );
  }
};

FumigacionManager.propTypes = {
  onBack: PropTypes.func,
  onLogout: PropTypes.func,
  user: PropTypes.object,
};

export default FumigacionManager;
