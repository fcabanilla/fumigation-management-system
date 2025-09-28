import React from 'react';
import PropTypes from 'prop-types';
import EntityManager from './EntityManager';
import FumigacionesList from './FumigacionesList';
import FumigacionForm from './FumigacionForm';
import FumigacionView from './FumigacionView';
import { useFumigaciones } from '../hooks/useApi';

/**
 * FumigacionManager - Versión refactorizada usando EntityManager genérico
 *
 * Usa el EntityManager genérico para gestión CRUD de fumigaciones
 */
const FumigacionManager = ({ onBack, onLogout, user }) => {
  // Hook para operaciones de fumigaciones
  const {
    fumigaciones,
    isLoading,
    createFumigacion,
    updateFumigacion,
    deleteFumigacion,
  } = useFumigaciones();

  // Configuración de la entidad fumigación
  const entityConfig = {
    name: 'Fumigación',
    namePlural: 'Fumigaciones',
    icon: '🚜', // String emoji en lugar de función
    showMapView: false, // Las fumigaciones no tienen vista de mapa independiente
    gender: 'feminine', // "la fumigación"
  };

  return (
    <EntityManager
      entityConfig={entityConfig}
      ListComponent={FumigacionesList}
      FormComponent={FumigacionForm}
      ViewComponent={FumigacionView}
      data={fumigaciones}
      isLoading={isLoading}
      onCreateEntity={createFumigacion}
      onUpdateEntity={updateFumigacion}
      onDeleteEntity={deleteFumigacion}
      onBack={onBack}
      // Props adicionales específicas para fumigaciones
      user={user}
      onLogout={onLogout}
    />
  );
};

FumigacionManager.propTypes = {
  onBack: PropTypes.func,
  onLogout: PropTypes.func,
  user: PropTypes.object,
};

export default FumigacionManager;
