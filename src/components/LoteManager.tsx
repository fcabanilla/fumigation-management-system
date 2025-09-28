import React from 'react';
import EntityManager from './EntityManager';
import LotesList from './LotesList';
import LoteForm from './LoteForm';
import LoteView from './LoteView';
import { MapList } from './MapComponent';
import { useLotes } from '../hooks/useApi';

// ==================== INTERFACES ====================

/** Props del componente LoteManager */
interface LoteManagerProps {
  /** Función callback para volver atrás */
  onBack: () => void;
}

// ==================== COMPONENT ====================

/**
 * LoteManager - Versión refactorizada usando EntityManager genérico
 *
 * Usa el EntityManager genérico para gestión CRUD de lotes
 */
const LoteManager: React.FC<LoteManagerProps> = ({ onBack }) => {
  // Hook para operaciones de lotes
  const { lotes, isLoading, createLote, updateLote, deleteLote } = useLotes();

  // Configuración de la entidad lote
  const entityConfig = {
    name: 'Lote',
    namePlural: 'Lotes',
    icon: '🌾', // String emoji en lugar de función
    showMapView: true, // Los lotes sí tienen vista de mapa
    gender: 'masculine' as const, // "el lote"
  };

  return (
    <EntityManager
      entityConfig={entityConfig}
      ListComponent={LotesList}
      FormComponent={LoteForm}
      ViewComponent={LoteView}
      MapComponent={MapList}
      data={lotes}
      isLoading={isLoading}
      onCreateEntity={createLote}
      onUpdateEntity={updateLote}
      onDeleteEntity={deleteLote}
      onBack={onBack}
    />
  );
};

export default LoteManager;
