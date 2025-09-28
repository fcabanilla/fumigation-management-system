import React, { useState } from "react";
import PropTypes from "prop-types";
import FumigacionesList from "./FumigacionesList";
import FumigacionForm from "./FumigacionForm";
import FumigacionView from "./FumigacionView";

// Estados del componente
const VIEWS = {
  LIST: "list",
  FORM: "form",
  VIEW: "view",
};

// Geometrías de ejemplo para trabajos previos
const getGeometriaEjemplo = (index) => {
  const geometrias = [
    // Campo Norte
    {
      type: "Feature",
      properties: { nombre: "Campo Norte", cultivo: "Soja" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-58.3816, -34.6037],
            [-58.38, -34.6037],
            [-58.38, -34.602],
            [-58.3816, -34.602],
            [-58.3816, -34.6037],
          ],
        ],
      },
    },
    // Lote Sur
    {
      type: "Feature",
      properties: { nombre: "Lote Sur", cultivo: "Maíz" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-58.396, -34.6118],
            [-58.394, -34.6118],
            [-58.394, -34.61],
            [-58.396, -34.61],
            [-58.396, -34.6118],
          ],
        ],
      },
    },
    // Campo Este
    {
      type: "Feature",
      properties: { nombre: "Campo Este", cultivo: "Trigo" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-58.375, -34.608],
            [-58.372, -34.608],
            [-58.372, -34.605],
            [-58.375, -34.605],
            [-58.375, -34.608],
          ],
        ],
      },
    },
  ];

  return geometrias[index % geometrias.length];
};

// Función para cargar fumigaciones desde localStorage
const getFumigaciones = () => {
  try {
    const fumigaciones = localStorage.getItem("fumigaciones");
    const data = fumigaciones ? JSON.parse(fumigaciones) : [];

    // Si no hay geometrías, agregar algunas de ejemplo
    return data.map((fumigacion, index) => {
      if (!fumigacion.geometria) {
        return {
          ...fumigacion,
          geometria: getGeometriaEjemplo(index),
        };
      }
      return fumigacion;
    });
  } catch {
    return [];
  }
};

// Función para guardar fumigaciones en localStorage
const saveFumigaciones = (fumigaciones) => {
  try {
    localStorage.setItem("fumigaciones", JSON.stringify(fumigaciones));
  } catch {
    // Error al guardar - continuar silenciosamente
  }
};

const FumigacionManager = ({ onBack, onLogout, user }) => {
  const [currentView, setCurrentView] = useState(VIEWS.LIST);
  const [selectedFumigacion, setSelectedFumigacion] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Handlers para las diferentes acciones
  const handleNew = () => {
    setSelectedFumigacion(null);
    setIsEdit(false);
    setCurrentView(VIEWS.FORM);
  };

  const handleEdit = (fumigacion) => {
    setSelectedFumigacion(fumigacion);
    setIsEdit(true);
    setCurrentView(VIEWS.FORM);
  };

  const handleView = (fumigacion) => {
    setSelectedFumigacion(fumigacion);
    setCurrentView(VIEWS.VIEW);
  };

  const handleDelete = (fumigacionId) => {
    // La eliminación se maneja en el componente FumigacionesList
    // Este callback se puede usar para refresh o notificaciones
  };

  const handleSave = (fumigacionData) => {
    const fumigaciones = getFumigaciones();

    if (isEdit && selectedFumigacion) {
      // Actualizar fumigación existente
      const updatedFumigaciones = fumigaciones.map((f) =>
        f.id === selectedFumigacion.id
          ? { ...fumigacionData, id: selectedFumigacion.id }
          : f
      );
      saveFumigaciones(updatedFumigaciones);
    } else {
      // Crear nueva fumigación
      const newFumigacion = {
        ...fumigacionData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      saveFumigaciones([...fumigaciones, newFumigacion]);
    }

    // Volver a la lista
    setCurrentView(VIEWS.LIST);
    setSelectedFumigacion(null);
    setIsEdit(false);
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
