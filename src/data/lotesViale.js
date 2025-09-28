// Lotes rurales cerca de Viale, Entre Ríos
// Viale se encuentra en las coordenadas aproximadas: -31.87°, -60.01°

export const lotesViale = [
  {
    id: "lote-viale-001",
    nombre: "Campo San Miguel",
    cultivo: "Soja",
    propietario: "Estancia San Miguel S.A.",
    descripcion:
      "Campo de 45 hectáreas al norte de Viale, suelo franco limoso ideal para soja. Riego por aspersión instalado.",
    fechaCreacion: "2024-03-15",
    hectareas: 45.2,
    geometria: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-60.005, -31.86],
            [-59.995, -31.86],
            [-59.995, -31.85],
            [-60.005, -31.85],
            [-60.005, -31.86],
          ],
        ],
      },
    },
  },
  {
    id: "lote-viale-002",
    nombre: "Lote Los Aromos",
    cultivo: "Maíz",
    propietario: "Cooperativa Agrícola Viale",
    descripcion:
      "Lote de 32 hectáreas con excelente drenaje. Historial de altos rendimientos en maíz tardío.",
    fechaCreacion: "2024-02-20",
    hectareas: 32.1,
    geometria: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-60.02, -31.875],
            [-60.01, -31.875],
            [-60.008, -31.868],
            [-60.018, -31.868],
            [-60.02, -31.875],
          ],
        ],
      },
    },
  },
  {
    id: "lote-viale-003",
    nombre: "Parcela El Trébol",
    cultivo: "Trigo",
    propietario: "Familia Rodríguez",
    descripcion:
      "Campo familiar de 28 hectáreas. Rotación trigo-soja. Suelo vertisol típico de la zona.",
    fechaCreacion: "2024-01-10",
    hectareas: 28.5,
    geometria: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-60.015, -31.885],
            [-60.005, -31.885],
            [-60.005, -31.878],
            [-60.015, -31.878],
            [-60.015, -31.885],
          ],
        ],
      },
    },
  },
  {
    id: "lote-viale-004",
    nombre: "Campo La Esperanza",
    cultivo: "Sorgo",
    propietario: "Agropecuaria Entre Ríos LTDA",
    descripcion:
      "Lote de 55 hectáreas al este de Viale. Producción de sorgo granífero para export. Sistema de siembra directa.",
    fechaCreacion: "2024-04-05",
    hectareas: 55.8,
    geometria: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-59.985, -31.87],
            [-59.97, -31.87],
            [-59.97, -31.86],
            [-59.985, -31.86],
            [-59.985, -31.87],
          ],
        ],
      },
    },
  },
  {
    id: "lote-viale-005",
    nombre: "Estancia Bella Vista",
    cultivo: "Soja",
    propietario: "Campos del Litoral S.R.L.",
    descripcion:
      "Gran extensión de 78 hectáreas sobre ruta provincial. Suelo clase I, altamente productivo.",
    fechaCreacion: "2024-02-28",
    hectareas: 78.3,
    geometria: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-60.03, -31.855],
            [-60.015, -31.855],
            [-60.015, -31.845],
            [-60.025, -31.84],
            [-60.035, -31.845],
            [-60.03, -31.855],
          ],
        ],
      },
    },
  },
  {
    id: "lote-viale-006",
    nombre: "Chacra Santa Rosa",
    cultivo: "Girasol",
    propietario: "Productores Asociados Viale",
    descripcion:
      "Campo de 36 hectáreas dedicado a girasol alto oleico. Contrato con aceitera local.",
    fechaCreacion: "2024-03-22",
    hectareas: 36.7,
    geometria: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-59.995, -31.89],
            [-59.985, -31.89],
            [-59.982, -31.882],
            [-59.992, -31.882],
            [-59.995, -31.89],
          ],
        ],
      },
    },
  },
  {
    id: "lote-viale-007",
    nombre: "Campo El Progreso",
    cultivo: "Maíz",
    propietario: "Hermanos Benítez",
    descripcion:
      "Lote de 42 hectáreas con tecnología de punta. GPS, monitores de rendimiento y agricultura de precisión.",
    fechaCreacion: "2024-01-25",
    hectareas: 42.1,
    geometria: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-60.008, -31.895],
            [-59.998, -31.895],
            [-59.998, -31.887],
            [-60.008, -31.887],
            [-60.008, -31.895],
          ],
        ],
      },
    },
  },
  {
    id: "lote-viale-008",
    nombre: "Lote San Martín",
    cultivo: "Avena",
    propietario: "Ganadería y Agricultura del Sur",
    descripcion:
      "Campo mixto de 25 hectáreas. Avena para forraje y pastoreo rotativo con hacienda.",
    fechaCreacion: "2024-04-12",
    hectareas: 25.3,
    geometria: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-60.025, -31.88],
            [-60.018, -31.88],
            [-60.018, -31.874],
            [-60.025, -31.874],
            [-60.025, -31.88],
          ],
        ],
      },
    },
  },
];

// Función para cargar los lotes en localStorage
export const cargarLotesViale = () => {
  const lotesExistentes = JSON.parse(localStorage.getItem("lotes") || "[]");

  // Verificar si ya existen lotes de Viale para no duplicar
  const lotesVialeExistentes = lotesExistentes.some(
    (lote) => lote.id && lote.id.includes("viale")
  );

  if (!lotesVialeExistentes) {
    const nuevosLotes = [...lotesExistentes, ...lotesViale];
    localStorage.setItem("lotes", JSON.stringify(nuevosLotes));
    return nuevosLotes;
  } else {
    return lotesExistentes;
  }
};

// Función para obtener estadísticas de los lotes de Viale
export const getEstadisticasViale = () => {
  const cultivoStats = {};
  let totalHectareas = 0;

  lotesViale.forEach((lote) => {
    if (!cultivoStats[lote.cultivo]) {
      cultivoStats[lote.cultivo] = { cantidad: 0, hectareas: 0 };
    }
    cultivoStats[lote.cultivo].cantidad++;
    cultivoStats[lote.cultivo].hectareas += lote.hectareas;
    totalHectareas += lote.hectareas;
  });

  return {
    totalLotes: lotesViale.length,
    totalHectareas: Math.round(totalHectareas * 10) / 10,
    cultivosStats: cultivoStats,
    ubicacion: "Viale, Entre Ríos",
    coordenadasCentro: [-60.01, -31.87],
  };
};
