import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LotesList from './LotesList';
import LoteForm from './LoteForm';
import LoteView from './LoteView';
import MapaLotes from './MapaLotes';
import { useLotes } from '../hooks/useApi';
import { FaPlus, FaEdit, FaMap, FaArrowLeft } from 'react-icons/fa';
import { GiWheat } from 'react-icons/gi';

// Estados del componente
const VIEWS = {
  LIST: 'list',
  FORM: 'form',
  VIEW: 'view',
  MAP: 'map',
};

// Styled Components
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

const ActionButton = styled.button`
  background: ${props =>
    props.variant === 'secondary'
      ? 'rgba(255,255,255,0.2)'
      : 'rgba(255,255,255,0.9)'};
  color: ${props => (props.variant === 'secondary' ? 'white' : '#4a7c59')};
  border: ${props =>
    props.variant === 'secondary' ? '1px solid rgba(255,255,255,0.3)' : 'none'};
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${props =>
      props.variant === 'secondary' ? 'rgba(255,255,255,0.3)' : 'white'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

// Datos iniciales ahora se manejan por el hook useLotes con MSW

const LoteManager = ({ onBack }) => {
  const [currentView, setCurrentView] = useState(VIEWS.LIST);
  const [selectedLote, setSelectedLote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Usar el hook moderno en lugar de localStorage
  const { lotes, isLoading, createLote, updateLote, deleteLote } = useLotes();

  // Inicialización de datos (solo si es necesario)
  useEffect(() => {
    // Los datos se cargan automáticamente por el hook useLotes
    // Este efecto se mantiene solo para posible inicialización futura
  }, []);

  // Funciones de manejo de lotes
  const handleSaveLote = async loteData => {
    try {
      if (isEditing && selectedLote) {
        // Editar lote existente usando la API
        const result = await updateLote(selectedLote.id, loteData);
        if (result.success) {
          console.log('Lote actualizado exitosamente');
        } else {
          console.error('Error actualizando lote:', result.error);
          return; // No cerrar el formulario si hay error
        }
      } else {
        // Crear nuevo lote usando la API
        const result = await createLote(loteData);
        if (result.success) {
          console.log('Lote creado exitosamente');
        } else {
          console.error('Error creando lote:', result.error);
          return; // No cerrar el formulario si hay error
        }
      }

      // Si llega aquí, la operación fue exitosa - volver a la lista
      setCurrentView(VIEWS.LIST);
      setSelectedLote(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error guardando lote:', error);
    }
  };

  const handleDeleteLote = async loteId => {
    try {
      const result = await deleteLote(loteId);
      if (result.success) {
        console.log('Lote eliminado exitosamente');

        // Si estamos viendo el lote que se eliminó, volver a la lista
        if (selectedLote && selectedLote.id === loteId) {
          setSelectedLote(null);
          setCurrentView(VIEWS.LIST);
        }
      } else {
        console.error('Error eliminando lote:', result.error);
      }
    } catch (error) {
      console.error('Error eliminando lote:', error);
    }
  };

  const handleViewLote = lote => {
    setSelectedLote(lote);
    setCurrentView(VIEWS.VIEW);
  };

  const handleEditLote = lote => {
    setSelectedLote(lote);
    setIsEditing(true);
    setCurrentView(VIEWS.FORM);
  };

  const handleNewLote = () => {
    setSelectedLote(null);
    setIsEditing(false);
    setCurrentView(VIEWS.FORM);
  };

  const handleBack = () => {
    if (currentView === VIEWS.FORM || currentView === VIEWS.VIEW) {
      setCurrentView(VIEWS.LIST);
      setSelectedLote(null);
      setIsEditing(false);
    } else {
      onBack();
    }
  };

  // Renderizar contenido según la vista actual
  const renderContent = () => {
    switch (currentView) {
      case VIEWS.LIST:
        return (
          <LotesList
            lotes={lotes}
            isLoading={isLoading}
            onView={handleViewLote}
            onEdit={handleEditLote}
            onDelete={handleDeleteLote}
          />
        );
      case VIEWS.FORM:
        return (
          <LoteForm
            lote={selectedLote}
            isEditing={isEditing}
            onSave={handleSaveLote}
            onCancel={() => setCurrentView(VIEWS.LIST)}
          />
        );
      case VIEWS.VIEW:
        return (
          <LoteView
            lote={selectedLote}
            onEdit={() => handleEditLote(selectedLote)}
            onDelete={() => handleDeleteLote(selectedLote.id)}
          />
        );
      case VIEWS.MAP:
        return <MapaLotes lotes={lotes} onSelectLote={handleViewLote} />;
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case VIEWS.LIST:
        return 'Gestión de Lotes';
      case VIEWS.FORM:
        return isEditing ? 'Editar Lote' : 'Nuevo Lote';
      case VIEWS.VIEW:
        return `Lote: ${selectedLote?.nombre}`;
      case VIEWS.MAP:
        return 'Mapa de Lotes';
      default:
        return 'Lotes';
    }
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>
            <GiWheat />
            {getPageTitle()}
          </Title>

          <ButtonGroup>
            <ActionButton variant="secondary" onClick={handleBack}>
              <FaArrowLeft />
              {currentView === VIEWS.LIST ? 'Volver' : 'Atrás'}
            </ActionButton>

            {currentView === VIEWS.LIST && (
              <>
                <ActionButton onClick={handleNewLote}>
                  <FaPlus />
                  Nuevo Lote
                </ActionButton>

                <ActionButton
                  variant="secondary"
                  onClick={() => setCurrentView(VIEWS.MAP)}
                >
                  <FaMap />
                  Ver Mapa
                </ActionButton>
              </>
            )}

            {currentView === VIEWS.VIEW && selectedLote && (
              <ActionButton onClick={() => handleEditLote(selectedLote)}>
                <FaEdit />
                Editar
              </ActionButton>
            )}
          </ButtonGroup>
        </HeaderContent>
      </Header>

      <ContentArea>{renderContent()}</ContentArea>
    </Container>
  );
};

LoteManager.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default LoteManager;
