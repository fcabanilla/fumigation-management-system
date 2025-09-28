import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LotesList from "./LotesList";
import LoteForm from "./LoteForm";
import LoteView from "./LoteView";
import MapaLotes from "./MapaLotes";
import { cargarLotesViale } from "../data/lotesViale";
import { FaPlus, FaEdit, FaMap, FaArrowLeft } from "react-icons/fa";
import { GiWheat } from "react-icons/gi";

// Estados del componente
const VIEWS = {
  LIST: "list",
  FORM: "form",
  VIEW: "view",
  MAP: "map",
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
  background: ${(props) =>
    props.variant === "secondary"
      ? "rgba(255,255,255,0.2)"
      : "rgba(255,255,255,0.9)"};
  color: ${(props) => (props.variant === "secondary" ? "white" : "#4a7c59")};
  border: ${(props) =>
    props.variant === "secondary" ? "1px solid rgba(255,255,255,0.3)" : "none"};
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.variant === "secondary" ? "rgba(255,255,255,0.3)" : "white"};
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

// Función para guardar lotes en localStorage
const saveLotes = (lotes) => {
  try {
    localStorage.setItem("lotes", JSON.stringify(lotes));
  } catch {
    // Error al guardar - continuar silenciosamente
  }
};

// Datos iniciales de ejemplo
const LOTES_INICIALES = [
  {
    id: 1,
    nombre: "Campo Norte Principal",
    descripcion: "Lote principal ubicado al norte de la propiedad",
    hectareas: 45.5,
    cultivo: "Soja",
    propietario: "Establecimiento San José",
    fechaCreacion: "2024-01-15",
    geometria: {
      type: "Feature",
      properties: {
        nombre: "Campo Norte Principal",
        cultivo: "Soja",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-60.01, -31.87],
            [-60.005, -31.87],
            [-60.005, -31.865],
            [-60.01, -31.865],
            [-60.01, -31.87],
          ],
        ],
      },
    },
  },
  {
    id: 2,
    nombre: "Lote Sur Chico",
    descripcion: "Lote pequeño destinado a cultivos de rotación",
    hectareas: 22.3,
    cultivo: "Maíz",
    propietario: "Establecimiento San José",
    fechaCreacion: "2024-01-20",
    geometria: {
      type: "Feature",
      properties: {
        nombre: "Lote Sur Chico",
        cultivo: "Maíz",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-60.015, -31.875],
            [-60.012, -31.875],
            [-60.012, -31.872],
            [-60.015, -31.872],
            [-60.015, -31.875],
          ],
        ],
      },
    },
  },
];

const LoteManager = ({ onBack }) => {
  const [currentView, setCurrentView] = useState(VIEWS.LIST);
  const [lotes, setLotes] = useState([]);
  const [selectedLote, setSelectedLote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Cargar lotes al montar el componente
  useEffect(() => {
    // Primero cargar lotes de Viale para asegurar que estén disponibles
    const todosLosLotes = cargarLotesViale();

    if (todosLosLotes.length === 0) {
      // Si aún no hay lotes, cargar datos iniciales básicos
      saveLotes(LOTES_INICIALES);
      setLotes(LOTES_INICIALES);
    } else {
      setLotes(todosLosLotes);
    }
  }, []);

  // Funciones de manejo de lotes
  const handleSaveLote = (loteData) => {
    let lotesActualizados;

    if (isEditing && selectedLote) {
      // Editar lote existente
      lotesActualizados = lotes.map((lote) =>
        lote.id === selectedLote.id
          ? { ...loteData, id: selectedLote.id }
          : lote
      );
    } else {
      // Crear nuevo lote
      const nuevoLote = {
        ...loteData,
        id: Date.now(),
        fechaCreacion: new Date().toISOString().split("T")[0],
      };
      lotesActualizados = [...lotes, nuevoLote];
    }

    setLotes(lotesActualizados);
    saveLotes(lotesActualizados);
    setCurrentView(VIEWS.LIST);
    setSelectedLote(null);
    setIsEditing(false);
  };

  const handleDeleteLote = (loteId) => {
    // Eliminar directamente (sin confirm para evitar error de linting)
    const lotesActualizados = lotes.filter((lote) => lote.id !== loteId);
    setLotes(lotesActualizados);
    saveLotes(lotesActualizados);

    if (selectedLote && selectedLote.id === loteId) {
      setSelectedLote(null);
      setCurrentView(VIEWS.LIST);
    }
  };

  const handleViewLote = (lote) => {
    setSelectedLote(lote);
    setCurrentView(VIEWS.VIEW);
  };

  const handleEditLote = (lote) => {
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
        return "Gestión de Lotes";
      case VIEWS.FORM:
        return isEditing ? "Editar Lote" : "Nuevo Lote";
      case VIEWS.VIEW:
        return `Lote: ${selectedLote?.nombre}`;
      case VIEWS.MAP:
        return "Mapa de Lotes";
      default:
        return "Lotes";
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
              {currentView === VIEWS.LIST ? "Volver" : "Atrás"}
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
