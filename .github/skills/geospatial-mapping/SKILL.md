---
name: geospatial-mapping
description: "Specialized skill for geospatial operations with Leaflet, GeoJSON, and Turf.js. Handles field polygon rendering, area calculations (hectares), centroid markers, and map layer management. Use when working with maps or geographic data."
argument-hint: "[task: render|calculate|edit|layer]"
---

# Geospatial Mapping Skill

## Technology Stack

- **Leaflet**: Interactive maps via `react-leaflet`
- **Turf.js**: Geospatial analysis (`@turf/turf`)
- **GeoJSON**: Standard data format for all geometries
- **Tile Layers**: OpenStreetMap (light mode), CartoDB Dark (dark mode)

## GeoJSON Data Model

All field geometries must follow GeoJSON standard:

```javascript
const fieldGeometry = {
  type: "Feature",
  properties: {
    nombre: "Campo Norte",
    cultivo: "Soja",
    superficie: 150.5,
  },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [lng, lat],
        [lng, lat],
        [lng, lat],
        [lng, lat],
        [lng, lat],
      ],
    ],
  },
};
```

**CRITICAL**: GeoJSON uses `[longitude, latitude]` order, NOT `[lat, lng]`.

## Area Calculation

```javascript
import * as turf from "@turf/turf";

// Convert m² to hectares
const calculateArea = (geojsonFeature) => {
  const areaM2 = turf.area(geojsonFeature);
  const hectares = areaM2 / 10000;
  return Math.round(hectares * 100) / 100;
};
```

## Centroid Markers

```javascript
const getCentroid = (geojsonFeature) => {
  const centroid = turf.centroid(geojsonFeature);
  return centroid.geometry.coordinates; // [lng, lat]
};
```

## Status Color Coding

```javascript
const STATUS_COLORS = {
  PLANIFICADA: "#3498db", // Blue
  EN_PROCESO: "#f39c12", // Orange
  COMPLETADA: "#27ae60", // Green
  CANCELADA: "#e74c3c", // Red
};

const getFieldStyle = (feature) => ({
  color: STATUS_COLORS[feature.properties.estado] || "#95a5a6",
  weight: 2,
  opacity: 0.8,
  fillOpacity: 0.35,
});
```

## Theme-Aware Tile Layers

```javascript
// From ThemeContext
const TILE_URLS = {
  light: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};
```

## Reference Files

- `src/components/MapaFumigacionesGeoespacial.js` - Main geospatial map component
- `src/components/MapaEditor.js` - Field polygon editor
- `src/components/MapaLotes.js` - Field listing map
- `src/data/lotesViale.js` - Sample GeoJSON data
