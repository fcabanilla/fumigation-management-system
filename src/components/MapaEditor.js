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
import {
  FaEdit,
  FaTrash,
  FaSquare,
  FaDrawPolygon,
  FaCalculator,
  FaInfoCircle,
  FaSave,
  FaUndo,
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

// Componente que maneja los controles de dibujo usando useMapEvents
const DrawingControls = ({ drawingMode, onPolygonCreate, setDrawingMode }) => {
  const [drawnItems] = useState(() => new L.FeatureGroup());
  const [activeDrawControl, setActiveDrawControl] = useState(null);
  const map = useMapEvents({});

  useEffect(() => {
    if (!map) {
      return;
    }

    // Agregar la capa de elementos dibujados al mapa si no está
    if (!map.hasLayer(drawnItems)) {
      map.addLayer(drawnItems);
    }

    // Limpiar control existente
    if (activeDrawControl) {
      try {
        map.removeControl(activeDrawControl);
      } catch (e) {
        // Control ya removido
      }
      setActiveDrawControl(null);
    }

    // Si hay un modo de dibujo activo, agregar el control
    if (drawingMode) {
      const drawControl = new L.Control.Draw({
        position: "topright",
        draw: {
          polygon: drawingMode === "polygon" ? {
            allowIntersection: false,
            showArea: true,
            drawError: {
              color: '#e1e100',
              message: '<strong>Error:</strong> ¡Los bordes no pueden cruzarse!'
            },
            shapeOptions: {
              color: '#4a7c59',
              weight: 3,
              fillOpacity: 0.3
            }
          } : false,
          rectangle: drawingMode === "rectangle" ? {
            shapeOptions: {
              color: '#4a7c59',
              weight: 3,
              fillOpacity: 0.3
            }
          } : false,
          circle: false,
          marker: false,
          polyline: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawnItems,
          remove: true,
        },
      });

      try {
        map.addControl(drawControl);
        setActiveDrawControl(drawControl);
      } catch (e) {
        // Error agregando control de dibujo
      }

      // Manejar eventos de dibujo
      const handleCreated = (e) => {
        const layer = e.layer;
        drawnItems.addLayer(layer);
        
        const geojson = layer.toGeoJSON();
        
        if (onPolygonCreate) {
          onPolygonCreate(geojson);
        }

        setDrawingMode(null);
      };

      map.on(L.Draw.Event.CREATED, handleCreated);

      return () => {
        map.off(L.Draw.Event.CREATED, handleCreated);
        if (activeDrawControl) {
          try {
            map.removeControl(activeDrawControl);
          } catch (e) {
            // Control ya removido
          }
          setActiveDrawControl(null);
        }
      };
    }
  }, [map, drawingMode, onPolygonCreate, setDrawingMode, drawnItems, activeDrawControl]);

  return null;
};

DrawingControls.propTypes = {
  drawingMode: PropTypes.string,
  onPolygonCreate: PropTypes.func,
  setDrawingMode: PropTypes.func,
};

const MapaEditor = ({ geometry, onChange, readonly = false, height = 400 }) => {
  const [drawingMode, setDrawingMode] = useState(null);
  const [tempPolygon, setTempPolygon] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

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

  const handlePolygonCreate = (geojson) => {
    const newGeometry = {
      type: "Feature",
      properties: {
        nombre: "Campo Nuevo",
        cultivo: "Por definir",
      },
      geometry: geojson.geometry,
    };

    if (onChange) {
      onChange(newGeometry);
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
    if (readonly) {
      return;
    }

    // Si ya está en ese modo, desactivarlo, sino activar el nuevo modo
    const newMode = drawingMode === mode ? null : mode;
    setDrawingMode(newMode);

    if (newMode) {
      setAlertMessage({
        type: "info",
        message: `Modo ${
          mode === "polygon" ? "polígono" : "rectángulo"
        } activado. Usa las herramientas que aparecen en el mapa para dibujar.`,
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

          {drawingMode && (
            <ToolButton
              onClick={() => {
                setDrawingMode(null);
                setAlertMessage({
                  type: "info",
                  message: "Modo de dibujo cancelado",
                });
                setTimeout(() => setAlertMessage(null), 2000);
              }}
            >
              <FaUndo />
              Cancelar Dibujo
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
                🎯 Modo {drawingMode === "polygon" ? "Polígono" : "Rectángulo"}{" "}
                activo
              </span>
            ) : (
              <span>👆 Selecciona una herramienta para dibujar</span>
            )}
          </div>
        </ToolbarContainer>
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
