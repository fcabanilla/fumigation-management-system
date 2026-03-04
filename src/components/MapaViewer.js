import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';

// Componente para ajustar el mapa cuando se renderiza la geometría
const MapController = ({ geometry, bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (geometry && bounds && map) {
      // Pequeño delay para asegurar que el mapa está completamente renderizado
      const timer = setTimeout(() => {
        try {
          map.fitBounds(bounds, {
            padding: [10, 10],
            maxZoom: 16,
          });
        } catch (error) {
          // Fallback silencioso
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [geometry, bounds, map]);

  return null;
};

MapController.propTypes = {
  geometry: PropTypes.object,
  bounds: PropTypes.array,
};

// Componente solo para visualizar geometrías (sin edición)
const MapaViewer = ({ geometry, height = '300px', zoom = 13 }) => {
  const [mapKey, setMapKey] = useState(Date.now());

  // Configurar el centro y zoom basado en la geometría
  const getMapConfig = () => {
    if (!geometry || !geometry.geometry) {
      return {
        center: [-32.0833, -59.85],
        zoom: 10,
        bounds: null,
      };
    }

    try {
      const bbox = turf.bbox(geometry);
      const center = turf.centroid(geometry);

      // Calcular un zoom apropiado basado en el área
      const area = turf.area(geometry);
      let zoomLevel = 15;

      if (area > 1000000) {
        // > 100 hectáreas
        zoomLevel = 12;
      } else if (area > 100000) {
        // > 10 hectáreas
        zoomLevel = 14;
      } else {
        zoomLevel = 16;
      }

      return {
        center: [
          center.geometry.coordinates[1],
          center.geometry.coordinates[0],
        ],
        bounds: [
          [bbox[1], bbox[0]], // SW
          [bbox[3], bbox[2]], // NE
        ],
        zoom: zoomLevel,
      };
    } catch (error) {
      return {
        center: [-32.0833, -59.85],
        zoom: 10,
        bounds: null,
      };
    }
  };

  const mapConfig = getMapConfig();

  // Re-generar key cuando cambie la geometría para forzar re-mount
  useEffect(() => {
    setMapKey(Date.now());
  }, [geometry]);

  // Estilo para la geometría
  const geoJsonStyle = {
    color: '#4a7c59',
    weight: 3,
    opacity: 1,
    fillColor: '#4a7c59',
    fillOpacity: 0.25,
  };

  if (!geometry) {
    return (
      <div
        style={{
          height,
          width: '100%',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
        }}
      >
        Sin geometría para mostrar
      </div>
    );
  }

  return (
    <div
      style={{
        height,
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid #ddd',
      }}
    >
      <MapContainer
        key={mapKey}
        center={mapConfig.center}
        zoom={mapConfig.zoom}
        style={{
          height: '100%',
          width: '100%',
        }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
        preferCanvas={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <GeoJSON
          key={`geojson-${mapKey}`}
          data={geometry}
          style={geoJsonStyle}
        />

        {mapConfig.bounds && (
          <MapController geometry={geometry} bounds={mapConfig.bounds} />
        )}
      </MapContainer>
    </div>
  );
};

MapaViewer.propTypes = {
  geometry: PropTypes.object,
  height: PropTypes.string,
  zoom: PropTypes.number,
};

export default MapaViewer;
