// MSW Handlers básicos para Fumigaciones usando MSW v1.x// MSW Handlers básicos para Fumigaciones usando MSW v1.x// ==================== MSW HANDLERS BÁSICOS PARA FUMIGACIONES ====================// ==================== MOCK API ARCHITECTURE ====================

import { rest } from 'msw';

import { rest } from 'msw';

const mockFumigaciones = [

  {

    id: "fum-001",

    nombre: "Fumigación Campo Norte",const mockFumigaciones = [

    campo: "Campo Norte",

    fechaPlanificada: "2024-03-15",  {import { rest } from 'msw';/**

    tipoTratamiento: "Preventivo",

    producto: "Atrazina 50% SC",    id: "fum-001",

    dosis: 2.5,

    hectareas: 25.5,    nombre: "Fumigación Campo Norte", * Sistema completo de Mock API para fumigaciones usando MSW (Mock Service Worker) v1.x

    costo: 15000,

    responsable: "Juan Operador",    campo: "Campo Norte",

    estado: "Completada",

    createdAt: "2024-03-10T09:00:00.000Z",    fechaPlanificada: "2024-03-15",// Mock data simple * Simula completamente un backend real con CRUD operations, paginación, 

    updatedAt: "2024-03-15T14:30:00.000Z"

  }    tipoTratamiento: "Preventivo",

];

    producto: "Atrazina 50% SC",const mockFumigaciones = [ * filtrado, y respuestas realistas para desarrollo y testing

export const fumigacionesHandlers = [

  rest.get('/api/fumigaciones', (req, res, ctx) => {    dosis: 2.5,

    return res(

      ctx.delay(300),    hectareas: 25.5,  { */

      ctx.status(200),

      ctx.json({    costo: 15000,

        data: mockFumigaciones,

        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }    responsable: "Juan Operador",    id: "fum-001",

      })

    );    estado: "Completada",

  }),

      createdAt: "2024-03-10T09:00:00.000Z",    nombre: "Fumigación Campo Norte - Preventiva",import { rest } from 'msw';

  rest.get('/api/fumigaciones/stats', (req, res, ctx) => {

    return res(    updatedAt: "2024-03-15T14:30:00.000Z"

      ctx.delay(200),

      ctx.status(200),  }    campo: "Campo Norte - Lote 15A",

      ctx.json({

        total: 1,];

        porEstado: { Completada: 1 },

        superficieTotal: 25.5,    fechaPlanificada: "2024-03-15",// Simple mock data

        porTipoTratamiento: { Preventivo: 1 }

      })export const fumigacionesHandlers = [

    );

  })  rest.get('/api/fumigaciones', (req, res, ctx) => {    tipoTratamiento: "Preventivo",const mockFumigaciones = [

];

    return res(

export default fumigacionesHandlers;
      ctx.delay(300),    producto: "Atrazina 50% SC",  {

      ctx.status(200),

      ctx.json({    dosis: 2.5,    id: "fum-001",

        data: mockFumigaciones,

        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }    hectareas: 25.5,    nombre: "Fumigación Campo Norte - Preventiva",

      })

    );    costo: 15000,    campo: "Campo Norte - Lote 15A",

  }),

      responsable: "Juan Operador",    fechaPlanificada: "2024-03-15",

  rest.get('/api/fumigaciones/stats', (req, res, ctx) => {

    return res(    estado: "Completada",    tipoTratamiento: "Preventivo",

      ctx.delay(200),

      ctx.status(200),    createdAt: "2024-03-10T09:00:00.000Z",    producto: "Atrazina 50% SC",

      ctx.json({

        total: 1,    updatedAt: "2024-03-15T14:30:00.000Z"    dosis: 2.5,

        porEstado: { Completada: 1 },

        superficieTotal: 25.5,  },    hectareas: 25.5,

        porTipoTratamiento: { Preventivo: 1 }

      })  {    costo: 15000,

    );

  })    id: "fum-002",    responsable: "Juan Operador",

];

    nombre: "Tratamiento Herbicida - Campo Sur",    estado: "Completada",

export default fumigacionesHandlers;
    campo: "Campo Sur - Lote 8B",    createdAt: "2024-03-10T09:00:00.000Z",

    fechaPlanificada: "2024-03-18",    updatedAt: "2024-03-15T14:30:00.000Z"

    tipoTratamiento: "Correctivo",  }

    producto: "Glifosato 48% SL",];

    dosis: 3.0,

    hectareas: 18.2,export const fumigacionesHandlers = [

    costo: 12000,  // GET /api/fumigaciones - Lista básica

    responsable: "María Operadora",  rest.get('/api/fumigaciones', (req, res, ctx) => {

    estado: "En Proceso",    return res(

    createdAt: "2024-03-12T11:15:00.000Z",      ctx.delay(300),

    updatedAt: "2024-03-18T16:45:00.000Z"      ctx.status(200),

  }      ctx.json({

];        data: mockFumigaciones,

        pagination: {

export const fumigacionesHandlers = [          page: 1,

  // GET /api/fumigaciones          limit: 10,

  rest.get('/api/fumigaciones', (req, res, ctx) => {          total: mockFumigaciones.length,

    return res(          totalPages: 1

      ctx.delay(300),        }

      ctx.status(200),      })

      ctx.json({    );

        data: mockFumigaciones,  }),

        pagination: {

          page: 1,  // GET /api/fumigaciones/stats - Estadísticas básicas

          limit: 10,  rest.get('/api/fumigaciones/stats', (req, res, ctx) => {

          total: mockFumigaciones.length,    return res(

          totalPages: 1      ctx.delay(200),

        }      ctx.status(200),

      })      ctx.json({

    );        total: mockFumigaciones.length,

  }),        porEstado: { Completada: 1 },

        superficieTotal: 25.5,

  // GET /api/fumigaciones/stats        porTipoTratamiento: { Preventivo: 1 }

  rest.get('/api/fumigaciones/stats', (req, res, ctx) => {      })

    const stats = {    );

      total: mockFumigaciones.length,  }),

      porEstado: mockFumigaciones.reduce((acc: any, f: any) => {];

        acc[f.estado] = (acc[f.estado] || 0) + 1;

        return acc;// ==================== TYPES ====================

      }, {}),

      superficieTotal: mockFumigaciones.reduce((sum: number, f: any) => sum + f.hectareas, 0),export interface FumigacionCreateRequest {

      porTipoTratamiento: mockFumigaciones.reduce((acc: any, f: any) => {  nombre: string;

        acc[f.tipoTratamiento] = (acc[f.tipoTratamiento] || 0) + 1;  campo: string;

        return acc;  fecha: string;

      }, {})  tipoTratamiento: string;

    };  producto: string;

  dosis: number;

    return res(  unidadDosis: string;

      ctx.delay(200),  superficie: number;

      ctx.status(200),  condicionesClimaticas?: {

      ctx.json(stats)    temperatura?: number;

    );    humedad?: number;

  }),    viento?: number;

    precipitacion?: number;

  // GET /api/trabajos-pasados - Mock básico  };

  rest.get('/api/trabajos-pasados', (req, res, ctx) => {  observaciones?: string;

    const mockTrabajos = [}

      {

        id: "tp-001",export interface FumigacionUpdateRequest {

        campo: "Campo Norte",  nombre?: string;

        tipoTratamiento: "Preventivo",  campo?: string;

        producto: "Atrazina 50% SC",  fecha?: string;

        dosis: 2.5,  tipoTratamiento?: string;

        observaciones: "Trabajo exitoso anterior"  producto?: string;

      }  dosis?: number;

    ];  unidadDosis?: string;

  superficie?: number;

    return res(  condicionesClimaticas?: {

      ctx.delay(300),    temperatura?: number;

      ctx.status(200),    humedad?: number;

      ctx.json(mockTrabajos)    viento?: number;

    );    precipitacion?: number;

  }),  };

];  observaciones?: string;

}

export default fumigacionesHandlers;
export interface FumigacionFiltersQuery {
  search?: string;
  campo?: string;
  tipoTratamiento?: string;
  producto?: string;
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: string;
  limit?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  field?: string;
  details?: any;
}

// ==================== MOCK DATA STORAGE ====================

let mockFumigaciones: Fumigacion[] = [
  {
    id: "fum-001",
    nombre: "Fumigación Campo Norte - Preventiva",
    campo: "Campo Norte - Lote 15A",
    fechaPlanificada: "2024-03-15",
    fechaRealizada: "2024-03-15",
    createdAt: "2024-03-10T09:00:00.000Z",
    updatedAt: "2024-03-15T14:30:00.000Z",
    tipoTratamiento: "Preventivo",
    producto: "Atrazina 50% SC",
    dosis: 2.5,
    hectareas: 25.5,
    costo: 15000,
    responsable: "Juan Operador",
    estado: "Completada",
    condicionesClimaticas: {
      temperatura: 22,
      humedad: 65,
      viento: 8
    },
    observaciones: "Aplicación exitosa en condiciones ideales. Sin eventos adversos."
  },
  {
    id: "fum-002",
    nombre: "Tratamiento Herbicida - Campo Sur",
    campo: "Campo Sur - Lote 8B",
    fecha: "2024-03-18",
    fechaCreacion: "2024-03-12T11:15:00.000Z",
    fechaActualizacion: "2024-03-18T16:45:00.000Z",
    tipoTratamiento: "Correctivo",
    producto: "Glifosato 48% SL",
    dosis: 3.0,
    unidadDosis: "L/ha",
    superficie: 18.2,
    estado: "completada",
    condicionesClimaticas: {
      temperatura: 25,
      humedad: 58,
      viento: 12,
      precipitacion: 0
    },
    observaciones: "Control efectivo de malezas resistentes. Resultados satisfactorios.",
    historialEstados: [
      { estado: "planificada", fecha: "2024-03-12T11:15:00.000Z", usuario: "admin", observaciones: "Tratamiento herbicida programado" },
      { estado: "aprobada", fecha: "2024-03-16T10:00:00.000Z", usuario: "supervisor", observaciones: "Condiciones meteorológicas favorables" },
      { estado: "en_progreso", fecha: "2024-03-18T09:30:00.000Z", usuario: "operador2", observaciones: "Aplicación en curso" },
      { estado: "completada", fecha: "2024-03-18T16:45:00.000Z", usuario: "operador2", observaciones: "Tratamiento completado" }
    ]
  },
  {
    id: "fum-003",
    nombre: "Fumigación Insecticida - Lote Central",
    campo: "Lote Central - Parcela 3C",
    fecha: "2024-03-20",
    fechaCreacion: "2024-03-18T13:20:00.000Z",
    fechaActualizacion: "2024-03-19T08:15:00.000Z",
    tipoTratamiento: "Preventivo",
    producto: "Cipermetrina 25% EC",
    dosis: 0.5,
    unidadDosis: "L/ha",
    superficie: 32.8,
    estado: "pausada",
    condicionesClimaticas: {
      temperatura: 28,
      humedad: 72,
      viento: 15,
      precipitacion: 2
    },
    observaciones: "Pausa temporal debido a condiciones climáticas adversas (viento fuerte).",
    historialEstados: [
      { estado: "planificada", fecha: "2024-03-18T13:20:00.000Z", usuario: "admin", observaciones: "Control preventivo de insectos" },
      { estado: "aprobada", fecha: "2024-03-19T07:00:00.000Z", usuario: "supervisor", observaciones: "Autorización para proceder" },
      { estado: "en_progreso", fecha: "2024-03-19T08:00:00.000Z", usuario: "operador1", observaciones: "Iniciando aplicación" },
      { estado: "pausada", fecha: "2024-03-19T08:15:00.000Z", usuario: "operador1", observaciones: "Pausa por viento fuerte >15 km/h" }
    ]
  },
  {
    id: "fum-004",
    nombre: "Aplicación Fungicida - Campo Este",
    campo: "Campo Este - Lote 12D",
    fecha: "2024-03-22",
    fechaCreacion: "2024-03-20T09:45:00.000Z",
    fechaActualizacion: "2024-03-20T09:45:00.000Z",
    tipoTratamiento: "Correctivo",
    producto: "Tebuconazole 25% EW",
    dosis: 1.2,
    unidadDosis: "L/ha",
    superficie: 15.6,
    estado: "planificada",
    condicionesClimaticas: {
      temperatura: 20,
      humedad: 55,
      viento: 6,
      precipitacion: 0
    },
    observaciones: "Tratamiento programado para controlar roya en cultivo de trigo.",
    historialEstados: [
      { estado: "planificada", fecha: "2024-03-20T09:45:00.000Z", usuario: "admin", observaciones: "Tratamiento fungicida programado" }
    ]
  }
];

let nextId = 5;

// ==================== HELPER FUNCTIONS ====================

const applyFilters = (fumigaciones: Fumigacion[], filters: FumigacionFiltersQuery) => {
  let filtered = [...fumigaciones];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(f => 
      f.nombre.toLowerCase().includes(search) ||
      f.campo.toLowerCase().includes(search) ||
      f.producto.toLowerCase().includes(search) ||
      f.observaciones?.toLowerCase().includes(search)
    );
  }

  if (filters.campo) {
    filtered = filtered.filter(f => f.campo.toLowerCase().includes(filters.campo!.toLowerCase()));
  }

  if (filters.tipoTratamiento) {
    filtered = filtered.filter(f => f.tipoTratamiento === filters.tipoTratamiento);
  }

  if (filters.producto) {
    filtered = filtered.filter(f => f.producto.toLowerCase().includes(filters.producto!.toLowerCase()));
  }

  if (filters.estado) {
    filtered = filtered.filter(f => f.estado === filters.estado);
  }

  if (filters.fechaDesde) {
    filtered = filtered.filter(f => f.fecha >= filters.fechaDesde!);
  }

  if (filters.fechaHasta) {
    filtered = filtered.filter(f => f.fecha <= filters.fechaHasta!);
  }

  return filtered;
};

const paginate = <T>(array: T[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = array.slice(startIndex, endIndex);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit)
    }
  };
};

// ==================== HANDLERS ====================

export const fumigacionesHandlers = [
  // GET /api/fumigaciones - Lista con filtros y paginación
  rest.get('/api/fumigaciones', async (req, res, ctx) => {
    const url = new URL(req.url);
    const filters: FumigacionFiltersQuery = {
      search: url.searchParams.get('search') || undefined,
      campo: url.searchParams.get('campo') || undefined,
      tipoTratamiento: url.searchParams.get('tipoTratamiento') || undefined,
      producto: url.searchParams.get('producto') || undefined,
      estado: url.searchParams.get('estado') || undefined,
      fechaDesde: url.searchParams.get('fechaDesde') || undefined,
      fechaHasta: url.searchParams.get('fechaHasta') || undefined,
      page: url.searchParams.get('page') || '1',
      limit: url.searchParams.get('limit') || '10'
    };

    const page = parseInt(filters.page!);
    const limit = parseInt(filters.limit!);

    const filtered = applyFilters(mockFumigaciones, filters);
    const result = paginate(filtered, page, limit);

    return res(
      ctx.delay(400),
      ctx.status(200),
      ctx.json(result)
    );
  }),

  // GET /api/fumigaciones/:id - Obtener fumigación específica
  rest.get('/api/fumigaciones/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const fumigacion = mockFumigaciones.find(f => f.id === id);

    if (!fumigacion) {
      return res(
        ctx.delay(200),
        ctx.status(404),
        ctx.json({ error: { message: 'Fumigación no encontrada', code: 'NOT_FOUND' } })
      );
    }

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json(fumigacion)
    );
  }),

  // POST /api/fumigaciones - Crear nueva fumigación
  rest.post('/api/fumigaciones', async (req, res, ctx) => {
    try {
      const data = await req.json() as FumigacionCreateRequest;

      // Validaciones básicas
      if (!data.nombre?.trim()) {
        return res(
          ctx.delay(200),
          ctx.status(400),
          ctx.json({ error: { message: 'El nombre es requerido', code: 'VALIDATION_ERROR', field: 'nombre' } })
        );
      }

      if (!data.campo?.trim()) {
        return res(
          ctx.delay(200),
          ctx.status(400),
          ctx.json({ error: { message: 'El campo es requerido', code: 'VALIDATION_ERROR', field: 'campo' } })
        );
      }

      if (data.dosis <= 0) {
        return res(
          ctx.delay(200),
          ctx.status(400),
          ctx.json({ error: { message: 'La dosis debe ser mayor a 0', code: 'VALIDATION_ERROR', field: 'dosis' } })
        );
      }

      const newFumigacion: Fumigacion = {
        id: `fum-${String(nextId++).padStart(3, '0')}`,
        ...data,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        estado: 'planificada',
        historialEstados: [
          {
            estado: 'planificada',
            fecha: new Date().toISOString(),
            usuario: 'current_user',
            observaciones: 'Fumigación creada'
          }
        ]
      };

      mockFumigaciones.push(newFumigacion);

      return res(
        ctx.delay(500),
        ctx.status(201),
        ctx.json(newFumigacion)
      );
    } catch (error) {
      return res(
        ctx.delay(200),
        ctx.status(400),
        ctx.json({ error: { message: 'Datos inválidos', code: 'INVALID_JSON' } })
      );
    }
  }),

  // PUT /api/fumigaciones/:id - Actualizar fumigación completa
  rest.put('/api/fumigaciones/:id', async (req, res, ctx) => {
    try {
      const { id } = req.params;
      const updates = await req.json() as FumigacionUpdateRequest;
      
      const index = mockFumigaciones.findIndex(f => f.id === id);
      if (index === -1) {
        return res(
          ctx.delay(200),
          ctx.status(404),
          ctx.json({ error: { message: 'Fumigación no encontrada', code: 'NOT_FOUND' } })
        );
      }

      const updated: Fumigacion = {
        ...mockFumigaciones[index],
        ...updates,
        fechaActualizacion: new Date().toISOString()
      };

      mockFumigaciones[index] = updated;

      return res(
        ctx.delay(400),
        ctx.status(200),
        ctx.json(updated)
      );
    } catch (error) {
      return res(
        ctx.delay(200),
        ctx.status(400),
        ctx.json({ error: { message: 'Datos inválidos', code: 'INVALID_JSON' } })
      );
    }
  }),

  // DELETE /api/fumigaciones/:id - Eliminar fumigación
  rest.delete('/api/fumigaciones/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const index = mockFumigaciones.findIndex(f => f.id === id);

    if (index === -1) {
      return res(
        ctx.delay(200),
        ctx.status(404),
        ctx.json({ error: { message: 'Fumigación no encontrada', code: 'NOT_FOUND' } })
      );
    }

    const deleted = mockFumigaciones[index];
    mockFumigaciones.splice(index, 1);

    return res(
      ctx.delay(600),
      ctx.status(200),
      ctx.json({ 
        id: deleted.id, 
        nombre: deleted.nombre,
        message: 'Fumigación eliminada exitosamente'
      })
    );
  }),

  // PATCH /api/fumigaciones/:id/estado - Cambiar estado
  rest.patch('/api/fumigaciones/:id/estado', async (req, res, ctx) => {
    try {
      const { id } = req.params;
      const { estado, observaciones } = await req.json();

      const index = mockFumigaciones.findIndex(f => f.id === id);
      if (index === -1) {
        return res(
          ctx.delay(200),
          ctx.status(404),
          ctx.json({ error: { message: 'Fumigación no encontrada', code: 'NOT_FOUND' } })
        );
      }

      const estadosValidos = ['planificada', 'aprobada', 'en_progreso', 'pausada', 'completada', 'cancelada'];
      if (!estadosValidos.includes(estado)) {
        return res(
          ctx.delay(200),
          ctx.status(400),
          ctx.json({ 
            error: { 
              message: 'Estado inválido', 
              code: 'INVALID_STATE',
              field: 'estado',
              details: { validStates: estadosValidos }
            }
          })
        );
      }

      const fumigacion = mockFumigaciones[index];
      fumigacion.estado = estado;
      fumigacion.fechaActualizacion = new Date().toISOString();
      
      // Agregar al historial
      fumigacion.historialEstados = fumigacion.historialEstados || [];
      fumigacion.historialEstados.push({
        estado,
        fecha: new Date().toISOString(),
        usuario: 'current_user',
        observaciones: observaciones || `Estado cambiado a ${estado}`
      });

      return res(
        ctx.delay(350),
        ctx.status(200),
        ctx.json(fumigacion)
      );
    } catch (error) {
      return res(
        ctx.delay(200),
        ctx.status(400),
        ctx.json({ error: { message: 'Datos inválidos', code: 'INVALID_JSON' } })
      );
    }
  }),

  // GET /api/fumigaciones/stats - Estadísticas globales
  rest.get('/api/fumigaciones/stats', async (req, res, ctx) => {
    const stats = {
      total: mockFumigaciones.length,
      porEstado: mockFumigaciones.reduce((acc, f) => {
        acc[f.estado] = (acc[f.estado] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      superficieTotal: mockFumigaciones.reduce((sum, f) => sum + f.superficie, 0),
      porTipoTratamiento: mockFumigaciones.reduce((acc, f) => {
        acc[f.tipoTratamiento] = (acc[f.tipoTratamiento] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      productosUsados: [...new Set(mockFumigaciones.map(f => f.producto))].length,
      ultimaActualizacion: new Date().toISOString()
    };

    return res(
      ctx.delay(250),
      ctx.status(200),
      ctx.json(stats)
    );
  }),

  // GET /api/trabajos-pasados - Lista de trabajos pasados
  rest.get('/api/trabajos-pasados', async (req, res, ctx) => {
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const tipoTratamiento = url.searchParams.get('tipoTratamiento');
    const producto = url.searchParams.get('producto');

    let filtered = [...TRABAJOS_PASADOS_MOCK];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(t => 
        t.campo.toLowerCase().includes(searchLower) ||
        t.producto.toLowerCase().includes(searchLower) ||
        t.observaciones?.toLowerCase().includes(searchLower)
      );
    }

    if (tipoTratamiento) {
      filtered = filtered.filter(t => t.tipoTratamiento === tipoTratamiento);
    }

    if (producto) {
      filtered = filtered.filter(t => t.producto.toLowerCase().includes(producto.toLowerCase()));
    }

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json(filtered)
    );
  }),

  // GET /api/trabajos-pasados/similares - Buscar trabajos similares
  rest.get('/api/trabajos-pasados/similares', async (req, res, ctx) => {
    const url = new URL(req.url);
    const campo = url.searchParams.get('campo');
    const tipoTratamiento = url.searchParams.get('tipoTratamiento');
    const producto = url.searchParams.get('producto');

    if (!campo || !tipoTratamiento) {
      return res(
        ctx.delay(200),
        ctx.status(400),
        ctx.json({ error: { message: 'Campo y tipo de tratamiento son requeridos', code: 'MISSING_PARAMS' } })
      );
    }

    let similares = TRABAJOS_PASADOS_MOCK.filter(t => {
      let match = t.campo.toLowerCase().includes(campo.toLowerCase()) ||
                  t.tipoTratamiento === tipoTratamiento;

      if (producto) {
        match = match && t.producto.toLowerCase().includes(producto.toLowerCase());
      }

      return match;
    });

    // Ordenar por relevancia (campo exacto > tipo tratamiento > producto similar)
    similares.sort((a, b) => {
      let scoreA = 0, scoreB = 0;

      if (a.campo.toLowerCase() === campo.toLowerCase()) scoreA += 3;
      else if (a.campo.toLowerCase().includes(campo.toLowerCase())) scoreA += 1;

      if (b.campo.toLowerCase() === campo.toLowerCase()) scoreB += 3;
      else if (b.campo.toLowerCase().includes(campo.toLowerCase())) scoreB += 1;

      if (a.tipoTratamiento === tipoTratamiento) scoreA += 2;
      if (b.tipoTratamiento === tipoTratamiento) scoreB += 2;

      if (producto) {
        if (a.producto.toLowerCase().includes(producto.toLowerCase())) scoreA += 1;
        if (b.producto.toLowerCase().includes(producto.toLowerCase())) scoreB += 1;
      }

      return scoreB - scoreA;
    });

    return res(
      ctx.delay(400),
      ctx.status(200),
      ctx.json(similares.slice(0, 10)) // Máximo 10 resultados
    );
  })
];

export default fumigacionesHandlers;