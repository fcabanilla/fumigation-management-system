import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  MapContainer,
  TileLayer,
  Polygon,
  useMapEvents,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import * as turf from "@turf/turf";

// Fix para íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

import {
  FaEdit,
  FaTrash,
  FaSquare,
  FaDrawPolygon,
  FaCalculator,
  FaInfoCircle,
  FaSave,
  FaUndo,
  FaTimes,
} from "react-icons/fa";

// Styled Components
const EditorContainer = styled.div`
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const EditorHeader = styled.div`
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditorTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
`;

const ToolbarContainer = styled.div`
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  padding: 0.5rem 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

const ToolButton = styled.button`
  background: ${(props) => (props.active ? "#4a7c59" : "white")};
  color: ${(props) => (props.active ? "white" : "#4a7c59")};
  border: 1px solid #4a7c59;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;

  &:hover {
    background: #4a7c59;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MapWrapper = styled.div`
  height: 400px;
  position: relative;

  .leaflet-container {
    height: 100%;
    width: 100%;
  }

  .leaflet-draw-toolbar {
    display: block !important; // Forzar mostrar la toolbar
  }

  .leaflet-draw-toolbar a {
    background-color: #4a7c59 !important;
    border-color: #4a7c59 !important;
  }

  .leaflet-draw-toolbar a:hover {
    background-color: #6b8e23 !important;
  }
`;

const InfoPanel = styled.div`
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  padding: 1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  text-align: center;
`;

const InfoValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #4a7c59;
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.2rem;
`;

const AlertMessage = styled.div`
  background: ${(props) => (props.type === "error" ? "#f8d7da" : "#d4edda")};
  color: ${(props) => (props.type === "error" ? "#721c24" : "#155724")};
  border: 1px solid
    ${(props) => (props.type === "error" ? "#f5c6cb" : "#c3e6cb")};
  border-radius: 6px;
  padding: 0.5rem;
  margin: 0.5rem 0;
  font-size: 0.85rem;
`;

// Componente que maneja el dibujo manual con click del ratón
const DrawingControls = ({ drawingMode, onPolygonCreate, setDrawingMode, currentDrawing, setCurrentDrawing }) => {
  const map = useMapEvents({
    click: (e) => {
      if (!drawingMode) return;
      
      if (drawingMode === 'polygon') {
        // Agregar punto al dibujo actual
        const { lat, lng } = e.latlng;
        const newPoint = [lng, lat];
        const newDrawing = [...currentDrawing, newPoint];
        
        console.log('Nuevo punto agregado:', newPoint, 'Total puntos:', newDrawing.length);
        setCurrentDrawing(newDrawing);
        
        // Log del estado actual para depuración
        console.log('Estado del dibujo:', {
          puntos: newDrawing.length,
          coordenadas: newDrawing
        });
        } else if (drawingMode === 'rectangle') {
        // Para rectángulo, necesitamos dos clicks
        if (!map._rectStart) {
          // Primer click - esquina inicial
          map._rectStart = e.latlng;
          console.log('Inicio rectángulo:', map._rectStart);
          const marker = L.marker([e.latlng.lat, e.latlng.lng], {
            color: 'red'
          }).addTo(map);
          map._rectStartMarker = marker;
        } else {
          // Segundo click - esquina final
          console.log('Final rectángulo:', e.latlng);
          const bounds = L.latLngBounds(map._rectStart, e.latlng);
          
          const geojson = {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [[
                [bounds.getWest(), bounds.getNorth()],
                [bounds.getEast(), bounds.getNorth()],
                [bounds.getEast(), bounds.getSouth()],
                [bounds.getWest(), bounds.getSouth()],
                [bounds.getWest(), bounds.getNorth()]
              ]]
            },
            properties: {}
          };
          
          // Limpiar elementos temporales
          if (map._rectStartMarker) {
            map.removeLayer(map._rectStartMarker);
            delete map._rectStartMarker;
          }
          
          delete map._rectStart;
          
          console.log('Rectángulo creado:', geojson);
          
          // Llamar al callback
          if (onPolygonCreate) {
            onPolygonCreate(geojson);
          }
          
          setDrawingMode(null);
        }
      }
    },    dblclick: (e) => {
      if (!drawingMode || drawingMode !== 'polygon' || currentDrawing.length < 3) return;
      
      // Finalizar el polígono
      const coordinates = [...currentDrawing];
      coordinates.push(coordinates[0]); // Cerrar el polígono
      
      const geojson = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [coordinates]
        },
        properties: {}
      };
      
      // Limpiar elementos temporales
      if (map._tempMarkers) {
        map._tempMarkers.forEach(marker => map.removeLayer(marker));
        delete map._tempMarkers;
      }
      
      if (map._tempPolygon) {
        map.removeLayer(map._tempPolygon);
        delete map._tempPolygon;
      }
      
      // Mostrar estadísticas finales antes de limpiar
      console.log('Polígono finalizado con doble click. Estadísticas finales:', calculateCurrentStats);
      
      // Limpiar el dibujo actual
      setCurrentDrawing([]);
      
      // Llamar al callback
      if (onPolygonCreate) {
        onPolygonCreate(geojson);
      }
      
      setDrawingMode(null);
    },
    
    contextmenu: (e) => {
      // Click derecho cancela el dibujo
      if (currentDrawing.length > 0) {
        if (map._tempMarkers) {
          map._tempMarkers.forEach(marker => map.removeLayer(marker));
          delete map._tempMarkers;
        }
        
        if (map._tempPolygon) {
          map.removeLayer(map._tempPolygon);
          delete map._tempPolygon;
        }
        
        setCurrentDrawing([]);
        setDrawingMode(null);
      }
      
      // Cancelar dibujo de rectángulo
      if (map._rectStart) {
        if (map._rectStartMarker) {
          map.removeLayer(map._rectStartMarker);
          delete map._rectStartMarker;
        }
        delete map._rectStart;
        setDrawingMode(null);
      }
    }
  });

  // Actualizar marcadores cuando cambia currentDrawing
  useEffect(() => {
    if (!map || drawingMode !== 'polygon') return;
    
    console.log('Actualizando marcadores para:', currentDrawing.length, 'puntos');
    
    // Limpiar marcadores existentes
    if (map._tempMarkers) {
      map._tempMarkers.forEach(marker => map.removeLayer(marker));
    }
    map._tempMarkers = [];
    
    // Limpiar polígono temporal
    if (map._tempPolygon) {
      map.removeLayer(map._tempPolygon);
      map._tempPolygon = null;
    }
    
    if (currentDrawing.length === 0) return;
    
    // Agregar marcadores para todos los puntos actuales
    currentDrawing.forEach(([lng, lat], index) => {
      const marker = L.marker([lat, lng], {
        title: `Punto ${index + 1}`
      }).addTo(map);
      
      if (!map._tempMarkers) map._tempMarkers = [];
      map._tempMarkers.push(marker);
    });
    
    // Actualizar polígono temporal si hay suficientes puntos
    if (currentDrawing.length >= 3) {
      const coords = currentDrawing.map(([lng, lat]) => [lat, lng]);
      coords.push(coords[0]); // Cerrar el polígono
      
      map._tempPolygon = L.polygon(coords, {
        color: '#4a7c59',
        weight: 3,
        fillOpacity: 0.3,
        dashArray: '5,5'
      }).addTo(map);
    }
  }, [map, currentDrawing, drawingMode]);

  // Cambiar el cursor del mapa según el modo
  useEffect(() => {
    if (!map) return;
    
    const container = map.getContainer();
    if (drawingMode) {
      container.style.cursor = 'crosshair';
      console.log('Cursor cambiado a crosshair para modo:', drawingMode);
    } else {
      container.style.cursor = '';
      console.log('Cursor restaurado a normal');
      
      // Limpiar elementos temporales cuando se sale del modo de dibujo
      if (map._tempMarkers) {
        map._tempMarkers.forEach(marker => map.removeLayer(marker));
        map._tempMarkers = [];
      }
      
      if (map._tempPolygon) {
        map.removeLayer(map._tempPolygon);
        map._tempPolygon = null;
      }
    }
    
    return () => {
      container.style.cursor = '';
    };
  }, [map, drawingMode]);

  return null;
};

DrawingControls.propTypes = {
  drawingMode: PropTypes.string,
  onPolygonCreate: PropTypes.func,
  setDrawingMode: PropTypes.func,
  currentDrawing: PropTypes.array,
  setCurrentDrawing: PropTypes.func,
};

const MapaEditor = ({ geometry, onChange, readonly = false, height = 400 }) => {
  const [drawingMode, setDrawingMode] = useState(null);
  const [tempPolygon, setTempPolygon] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [currentDrawing, setCurrentDrawing] = useState([]);
  const [currentStats, setCurrentStats] = useState({ area: 0, perimetro: 0, vertices: 0 });

  // Calcular centro del mapa basado en la geometría o usar Viale como defecto
  const mapCenter = React.useMemo(() => {
    if (geometry && geometry.geometry && geometry.geometry.coordinates && geometry.geometry.coordinates[0]) {
      try {
        const coords = geometry.geometry.coordinates[0];
        const lats = coords.map(([lng, lat]) => lat);
        const lngs = coords.map(([lng, lat]) => lng);
        
        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
        
        return [centerLat, centerLng];
      } catch {
        return [-31.87, -60.01]; // Fallback a Viale, Entre Ríos
      }
    }
    return [-31.87, -60.01]; // Viale, Entre Ríos por defecto
  }, [geometry]);

  // Calcular zoom adecuado basado en la geometría
  const mapZoom = React.useMemo(() => {
    if (geometry && geometry.geometry && geometry.geometry.coordinates && geometry.geometry.coordinates[0]) {
      try {
        const coords = geometry.geometry.coordinates[0];
        const lats = coords.map(([lng, lat]) => lat);
        const lngs = coords.map(([lng, lat]) => lng);
        
        const latRange = Math.max(...lats) - Math.min(...lats);
        const lngRange = Math.max(...lngs) - Math.min(...lngs);
        const maxRange = Math.max(latRange, lngRange);
        
        // Ajustar zoom según el rango de coordenadas
        if (maxRange > 0.1) return 10;      // Lotes muy grandes
        if (maxRange > 0.05) return 12;     // Lotes grandes 
        if (maxRange > 0.01) return 14;     // Lotes medianos
        return 16;                          // Lotes pequeños
      } catch {
        return 13;
      }
    }
    return 13; // Zoom por defecto para nuevos lotes
  }, [geometry]);

  // Calcular estadísticas de la geometría
  const estadisticas = React.useMemo(() => {
    if (!geometry || !geometry.geometry) {
      return {
        area: 0,
        perimetro: 0,
        vertices: 0,
      };
    }

    const area = turf.area(geometry) / 10000; // Convertir a hectáreas
    const perimetro = turf.length(geometry, { units: "kilometers" });
    const vertices = geometry.geometry.coordinates[0].length - 1; // -1 porque el último punto es igual al primero

    return {
      area: Math.round(area * 100) / 100,
      perimetro: Math.round(perimetro * 100) / 100,
      vertices,
    };
  }, [geometry]);

  // Calcular estadísticas en tiempo real durante el dibujo
  const calculateCurrentStats = React.useMemo(() => {
    const vertices = currentDrawing.length;
    
    if (!currentDrawing || vertices === 0) {
      return { 
        area: 0, 
        perimetro: 0, 
        vertices: 0,
        distanciaTotal: 0,
        status: 'empty'
      };
    }

    if (vertices === 1) {
      return {
        area: 0,
        perimetro: 0,
        vertices: 1,
        distanciaTotal: 0,
        status: 'first_point'
      };
    }

    if (vertices === 2) {
      // Calcular distancia entre los dos puntos
      const [lng1, lat1] = currentDrawing[0];
      const [lng2, lat2] = currentDrawing[1];
      
      const from = turf.point([lng1, lat1]);
      const to = turf.point([lng2, lat2]);
      const distance = turf.distance(from, to, { units: 'kilometers' });
      
      return {
        area: 0,
        perimetro: 0,
        vertices: 2,
        distanciaTotal: Math.round(distance * 1000) / 1000, // En km con 3 decimales
        status: 'two_points'
      };
    }

    try {
      // Con 3+ puntos, calcular área y perímetro del polígono
      const coords = [...currentDrawing];
      coords.push(coords[0]); // Cerrar el polígono
      
      const tempGeometry = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [coords]
        }
      };

      const area = turf.area(tempGeometry) / 10000; // Convertir a hectáreas
      const perimetro = turf.length(tempGeometry, { units: "kilometers" });

      return {
        area: Math.round(area * 100) / 100,
        perimetro: Math.round(perimetro * 100) / 100,
        vertices,
        distanciaTotal: Math.round(perimetro * 100) / 100,
        status: 'polygon'
      };
    } catch (error) {
      console.error('Error calculando estadísticas:', error);
      return { 
        area: 0, 
        perimetro: 0, 
        vertices,
        distanciaTotal: 0,
        status: 'error'
      };
    }
  }, [currentDrawing]);

  // Actualizar estadísticas cuando cambie el dibujo
  useEffect(() => {
    setCurrentStats(calculateCurrentStats);
  }, [calculateCurrentStats]);

  const handlePolygonCreate = (geojson) => {
    console.log('handlePolygonCreate llamado con:', geojson);
    
    const newGeometry = {
      type: "Feature",
      properties: {
        nombre: "Campo Nuevo",
        cultivo: "Por definir",
      },
      geometry: geojson.geometry,
    };

    console.log('Nueva geometría creada:', newGeometry);

    if (onChange) {
      onChange(newGeometry);
      console.log('onChange llamado');
    }

    setAlertMessage({
      type: "success",
      message: `Polígono creado exitosamente. Área: ${
        Math.round((turf.area(newGeometry) / 10000) * 100) / 100
      } hectáreas`,
    });

    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleStartDrawing = (mode) => {
    console.log('handleStartDrawing llamado con modo:', mode, 'Estado actual:', drawingMode);
    
    if (readonly) {
      console.log('Modo readonly, cancelando dibujo');
      return;
    }

    // Si ya está en ese modo, desactivarlo, sino activar el nuevo modo
    const newMode = drawingMode === mode ? null : mode;
    console.log('Nuevo modo será:', newMode);
    
    setDrawingMode(newMode);
    setCurrentDrawing([]); // Limpiar dibujo anterior

    if (newMode) {
      const instructions = mode === "polygon" 
        ? "Haz click para agregar puntos. Doble click para finalizar. Click derecho para cancelar."
        : "Haz click en dos esquinas opuestas para crear el rectángulo. Click derecho para cancelar.";
      
      setAlertMessage({
        type: "info",
        message: `Modo ${mode === "polygon" ? "polígono" : "rectángulo"} activado. ${instructions}`,
      });
    } else {
      setAlertMessage({
        type: "info",
        message: "Modo de dibujo desactivado.",
      });
      setTimeout(() => setAlertMessage(null), 2000);
    }
  };

  const handleClearGeometry = () => {
    if (readonly) {
      return;
    }
    if (onChange) {
      onChange(null);
    }
    setAlertMessage({
      type: "info",
      message: "Geometría eliminada",
    });
  };

  const handleSaveGeometry = () => {
    if (tempPolygon && onChange) {
      onChange(tempPolygon);
      setTempPolygon(null);
      setAlertMessage({
        type: "success",
        message: "Geometría guardada exitosamente",
      });
    }
  };

  const handleRemoveLastPoint = () => {
    if (currentDrawing.length > 0) {
      const newDrawing = [...currentDrawing];
      newDrawing.pop();
      setCurrentDrawing(newDrawing);
      
      setAlertMessage({
        type: "info",
        message: `Último punto eliminado. Puntos restantes: ${newDrawing.length}`,
      });
      setTimeout(() => setAlertMessage(null), 2000);
    }
  };

  const handleUndoDrawing = () => {
    setCurrentDrawing([]);
    setDrawingMode(null);
    setAlertMessage({
      type: "info", 
      message: "Dibujo cancelado y puntos eliminados",
    });
    setTimeout(() => setAlertMessage(null), 2000);
  };

  const handleConfirmPolygon = () => {
    console.log('🔵 BOTÓN CONFIRMAR CLICKEADO - Puntos actuales:', currentDrawing.length);
    
    if (currentDrawing.length < 3) {
      console.log('❌ Insuficientes puntos para confirmar');
      setAlertMessage({
        type: "error",
        message: "Necesitas al menos 3 puntos para crear un polígono",
      });
      setTimeout(() => setAlertMessage(null), 2000);
      return;
    }

    // Crear el GeoJSON del polígono
    const coordinates = [...currentDrawing];
    coordinates.push(coordinates[0]); // Cerrar el polígono
    
    const geojson = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coordinates]
      },
      properties: {}
    };

    console.log('Polígono confirmado:', geojson);
    
    // Crear la geometría en el formato correcto para el formulario
    const newGeometry = {
      type: "Feature",
      properties: {
        nombre: "Campo Nuevo",
        cultivo: "Por definir",
      },
      geometry: geojson.geometry,
    };

    console.log('Nueva geometría creada:', newGeometry);
    console.log('Función onChange disponible:', typeof onChange);
    
    // Llamar al callback onChange directamente
    if (onChange) {
      onChange(newGeometry);
      console.log('✅ onChange llamado exitosamente con geometría:', newGeometry);
    } else {
      console.error('❌ No hay función onChange disponible');
    }
    
    // Limpiar elementos temporales y resetear estado
    setCurrentDrawing([]);
    setDrawingMode(null);
    
    // Mostrar mensaje de éxito
    setAlertMessage({
      type: "success",
      message: `Polígono confirmado exitosamente. Área: ${
        Math.round((turf.area(newGeometry) / 10000) * 100) / 100
      } hectáreas`,
    });

    setTimeout(() => setAlertMessage(null), 3000);
  };

  const convertToLeafletCoordinates = (coordinates) => {
    return coordinates[0].map(([lng, lat]) => [lat, lng]);
  };

  return (
    <EditorContainer>
      <EditorHeader>
        <EditorTitle>
          <FaEdit />
          Editor de Geometría de Campo
        </EditorTitle>
        {!readonly && (
          <div>
            {geometry && (
              <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                {estadisticas.area} ha
              </span>
            )}
          </div>
        )}
      </EditorHeader>

      {!readonly && (
        <ToolbarContainer>
          <ToolButton
            active={drawingMode === "polygon"}
            onClick={() => handleStartDrawing("polygon")}
          >
            <FaDrawPolygon />
            Polígono
          </ToolButton>

          <ToolButton
            active={drawingMode === "rectangle"}
            onClick={() => handleStartDrawing("rectangle")}
          >
            <FaSquare />
            Rectángulo
          </ToolButton>

          <ToolButton onClick={handleClearGeometry} disabled={!geometry}>
            <FaTrash />
            Limpiar
          </ToolButton>

          {drawingMode === "polygon" && currentDrawing.length > 0 && (
            <ToolButton
              onClick={handleRemoveLastPoint}
              disabled={currentDrawing.length === 0}
            >
              <FaUndo />
              Eliminar Último
            </ToolButton>
          )}

          {drawingMode === "polygon" && currentDrawing.length >= 3 && (
            <ToolButton
              onClick={handleConfirmPolygon}
              style={{ backgroundColor: '#28a745', color: 'white' }}
            >
              <FaSave />
              Confirmar Polígono
            </ToolButton>
          )}

          {drawingMode && (
            <ToolButton
              onClick={handleUndoDrawing}
            >
              <FaTimes />
              Cancelar Todo
            </ToolButton>
          )}

          {tempPolygon && (
            <ToolButton onClick={handleSaveGeometry}>
              <FaSave />
              Guardar
            </ToolButton>
          )}

          <div
            style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#666" }}
          >
            {drawingMode ? (
              <span>
                {drawingMode === "polygon" ? (
                  <>
                    🎯 Polígono - Puntos: {currentDrawing.length}
                    {currentStats.status === 'first_point' && " - Agrega más puntos"}
                    {currentStats.status === 'two_points' && ` - Distancia: ${currentStats.distanciaTotal}km`}
                    {currentStats.status === 'polygon' && ` - ${currentStats.area}ha ✓`}
                  </>
                ) : (
                  "🎯 Modo Rectángulo activo"
                )}
              </span>
            ) : (
              <span>👆 Selecciona una herramienta para dibujar</span>
            )}
          </div>
        </ToolbarContainer>
      )}

      {/* Panel de previsualización en tiempo real */}
      {!readonly && drawingMode === "polygon" && currentDrawing.length > 0 && (
        <div style={{
          background: currentStats.status === 'polygon' ? '#f8f9fa' : '#fff3cd',
          border: `1px solid ${currentStats.status === 'polygon' ? '#dee2e6' : '#ffeaa7'}`,
          borderRadius: '8px',
          padding: '12px',
          margin: '8px 16px',
          fontSize: '0.9rem',
          color: '#495057'
        }}>
          {currentStats.status === 'first_point' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2em' }}>📍</span>
              <span><strong>Primer punto agregado.</strong> Haz click en otro lugar para continuar.</span>
            </div>
          )}
          
          {currentStats.status === 'two_points' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '1.1em' }}>📏</span>
                <strong>Distancia:</strong> {currentStats.distanciaTotal} km
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaDrawPolygon style={{ color: '#6f42c1' }} />
                <strong>Puntos:</strong> {currentStats.vertices}
              </div>
              <span style={{ fontStyle: 'italic', color: '#6c757d' }}>
                Agrega un punto más para crear el polígono
              </span>
            </div>
          )}
          
          {currentStats.status === 'polygon' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '15px',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaCalculator style={{ color: '#28a745' }} />
                <strong>Área:</strong> {currentStats.area} ha
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaInfoCircle style={{ color: '#007bff' }} />
                <strong>Perímetro:</strong> {currentStats.perimetro} km
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaDrawPolygon style={{ color: '#6f42c1' }} />
                <strong>Vértices:</strong> {currentStats.vertices}
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px',
                background: '#d4edda',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.85em'
              }}>
                <span>✅</span>
                <strong>Listo para confirmar</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {alertMessage && (
        <AlertMessage type={alertMessage.type}>
          <FaInfoCircle /> {alertMessage.message}
        </AlertMessage>
      )}

      <MapWrapper style={{ height: `${height}px` }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {!readonly && (
            <DrawingControls
              drawingMode={drawingMode}
              onPolygonCreate={handlePolygonCreate}
              setDrawingMode={setDrawingMode}
              currentDrawing={currentDrawing}
              setCurrentDrawing={setCurrentDrawing}
            />
          )}

          {geometry && geometry.geometry && (
            <Polygon
              positions={convertToLeafletCoordinates(
                geometry.geometry.coordinates
              )}
              color="#4a7c59"
              fillColor="#4a7c59"
              fillOpacity={0.3}
              weight={3}
            >
              <Popup>
                <div>
                  <h4>{geometry.properties?.nombre || "Campo"}</h4>
                  <p>
                    <strong>Área:</strong> {estadisticas.area} hectáreas
                  </p>
                  <p>
                    <strong>Perímetro:</strong> {estadisticas.perimetro} km
                  </p>
                  <p>
                    <strong>Vértices:</strong> {estadisticas.vertices}
                  </p>
                  {geometry.properties?.cultivo && (
                    <p>
                      <strong>Cultivo:</strong> {geometry.properties.cultivo}
                    </p>
                  )}
                </div>
              </Popup>
            </Polygon>
          )}

          {tempPolygon && (
            <Polygon
              positions={convertToLeafletCoordinates(
                tempPolygon.geometry.coordinates
              )}
              color="#17a2b8"
              fillColor="#17a2b8"
              fillOpacity={0.2}
              weight={2}
              dashArray="5, 10"
            >
              <Popup>
                <div>
                  <h4>Polígono Temporal</h4>
                  <p>Presiona "Guardar" para confirmar</p>
                </div>
              </Popup>
            </Polygon>
          )}
        </MapContainer>
      </MapWrapper>

      <InfoPanel>
        <InfoGrid>
          <InfoItem>
            <InfoValue>
              <FaCalculator /> {estadisticas.area}
            </InfoValue>
            <InfoLabel>Hectáreas</InfoLabel>
          </InfoItem>

          <InfoItem>
            <InfoValue>{estadisticas.perimetro}</InfoValue>
            <InfoLabel>Perímetro (km)</InfoLabel>
          </InfoItem>

          <InfoItem>
            <InfoValue>{estadisticas.vertices}</InfoValue>
            <InfoLabel>Vértices</InfoLabel>
          </InfoItem>

          <InfoItem>
            <InfoValue>{geometry ? "Definido" : "Sin definir"}</InfoValue>
            <InfoLabel>Estado</InfoLabel>
          </InfoItem>
        </InfoGrid>
      </InfoPanel>
    </EditorContainer>
  );
};

MapaEditor.propTypes = {
  geometry: PropTypes.object,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  height: PropTypes.number,
};

export default MapaEditor;
