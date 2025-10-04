// @ts-nocheck
import { Fumigacion, Lote, User } from '../types/index';

// Seed data para fumigaciones
export const fumigacionesSeed: Fumigacion[] = [
  {
    id: '1',
    nombre: 'Tratamiento Preventivo Campo Norte',
    campo: 'Campo Norte - Lote A',
    tipoTratamiento: 'preventivo',
    producto: 'Insecticida Organofosforado',
    dosis: 2.5,
    fechaPlanificada: '2025-10-15',
    fechaRealizada: undefined,
    estado: 'PLANIFICADA',
    hectareas: 45.5,
    costo: 12500,
    responsable: 'Juan Pérez',
    equipoUtilizado: 'Pulverizador Autopropulsado',
    observaciones: 'Aplicar en horas de baja temperatura, evitar viento.',
    condicionesClimaticas: {
      temperatura: 22,
      humedad: 65,
      viento: 5,
      presion: 1013,
    },
    createdAt: '2025-09-27T10:30:00Z',
    updatedAt: '2025-09-27T10:30:00Z',
  },
  {
    id: '2',
    nombre: 'Fumigación Correctiva Plagas',
    campo: 'Campo Sur - Lote B',
    tipoTratamiento: 'correctivo',
    producto: 'Fungicida Sistémico',
    dosis: 1.8,
    fechaPlanificada: '2025-10-20',
    fechaRealizada: '2025-10-20',
    estado: 'COMPLETADA',
    hectareas: 32.0,
    costo: 18900,
    responsable: 'María González',
    equipoUtilizado: 'Fumigadora Aérea',
    observaciones: 'Tratamiento exitoso contra roya de la soja.',
    condicionesClimaticas: {
      temperatura: 18,
      humedad: 70,
      viento: 3,
      presion: 1015,
    },
    resultados: {
      efectividad: 92,
      cobertura: 98,
      incidencias: [],
    },
    createdAt: '2025-09-25T09:15:00Z',
    updatedAt: '2025-10-21T08:45:00Z',
  },
  {
    id: '3',
    nombre: 'Aplicación Masiva Herbicida',
    campo: 'Campo Centro - Multiple',
    tipoTratamiento: 'correctivo',
    producto: 'Herbicida Post-emergente',
    dosis: 3.2,
    fechaPlanificada: '2025-10-01',
    fechaRealizada: undefined,
    estado: 'EN_PROCESO',
    hectareas: 125.0,
    costo: 35600,
    responsable: 'Carlos Rodriguez',
    equipoUtilizado: 'Avión Fumigador',
    observaciones: 'Coordinación con torre de control completada.',
    condicionesClimaticas: {
      temperatura: 25,
      humedad: 55,
      viento: 8,
      presion: 1010,
    },
    createdAt: '2025-09-25T09:00:00Z',
    updatedAt: '2025-10-01T08:00:00Z',
  },
];

// Seed data para lotes
export const lotesSeed: Lote[] = [
  {
    id: '1',
    nombre: 'Campo Norte Principal',
    descripcion: 'Lote principal ubicado al norte de la propiedad',
    hectareas: 45.5,
    cultivo: 'Soja',
    propietario: 'Establecimiento San José',
    fechaCreacion: '2024-01-15',
    estado: 'activo',
    geometria: {
      type: 'Feature',
      properties: {
        nombre: 'Campo Norte Principal',
        cultivo: 'Soja',
      },
      geometry: {
        type: 'Polygon',
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
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    nombre: 'Campo Sur Experimental',
    descripcion: 'Área de pruebas para nuevos cultivos',
    hectareas: 32.0,
    cultivo: 'Maíz',
    propietario: 'Establecimiento San José',
    fechaCreacion: '2024-02-10',
    estado: 'activo',
    geometria: {
      type: 'Feature',
      properties: {
        nombre: 'Campo Sur Experimental',
        cultivo: 'Maíz',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-58.385, -34.608],
            [-58.375, -34.608],
            [-58.375, -34.615],
            [-58.385, -34.615],
            [-58.385, -34.608],
          ],
        ],
      },
    },
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
  },
  {
    id: '3',
    nombre: 'Campo Centro Multiple',
    descripcion: 'Gran extensión dividida en múltiples sectores',
    hectareas: 125.0,
    cultivo: 'Trigo',
    propietario: 'Establecimiento San José',
    fechaCreacion: '2024-01-20',
    estado: 'activo',
    geometria: {
      type: 'Feature',
      properties: {
        nombre: 'Campo Centro Multiple',
        cultivo: 'Trigo',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-58.395, -34.595],
            [-58.365, -34.595],
            [-58.365, -34.62],
            [-58.395, -34.62],
            [-58.395, -34.595],
          ],
        ],
      },
    },
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
  },
];

// Seed data para usuario demo
export const userSeed: User = {
  id: '1',
  username: 'admin',
  email: 'admin@fumigacion.com',
  nombre: 'Administrador',
  apellido: 'Sistema',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};
