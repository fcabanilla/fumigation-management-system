// handlers.ts - MSW handlers simplificados sin tipos complejos
import { http, HttpResponse } from 'msw';

// In-memory storage simple
const fumigaciones = [
  {
    id: '1',
    nombre: 'Tratamiento Norte',
    campo: 'Campo Norte',
    tipoTratamiento: 'preventivo',
    producto: 'Insecticida',
    dosis: 2.5,
    fechaPlanificada: '2025-10-15',
    estado: 'PLANIFICADA',
    hectareas: 45.5,
    costo: 12500,
    responsable: 'Juan Pérez',
    equipoUtilizado: 'Pulverizador',
  },
  {
    id: '2', 
    nombre: 'Fumigación Sur',
    campo: 'Campo Sur',
    tipoTratamiento: 'correctivo',
    producto: 'Fungicida',
    dosis: 1.8,
    fechaPlanificada: '2025-10-20',
    estado: 'COMPLETADA',
    hectareas: 32.0,
    costo: 18900,
    responsable: 'María González',
    equipoUtilizado: 'Fumigadora',
  }
];

const lotes = [
  {
    id: '1',
    nombre: 'Campo Norte Principal',
    descripcion: 'Lote principal',
    hectareas: 45.5,
    cultivo: 'Soja',
    propietario: 'Establecimiento San José',
  },
  {
    id: '2',
    nombre: 'Campo Sur',
    descripcion: 'Área experimental',
    hectareas: 32.0,
    cultivo: 'Maíz', 
    propietario: 'Establecimiento San José',
  }
];

// Helper para simular delay
const delay = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

export const handlers = [
  // AUTH LOGIN
  http.post('/api/auth/login', async ({ request }) => {
    await delay();
    
    try {
      const body = await request.json() as any;
      
      if ((body.username === 'admin' || body.username === 'admin@fumigacion.com') && 
          body.password === 'fumigacion123') {
        return HttpResponse.json({
          success: true,
          message: 'Login exitoso',
          data: {
            user: { 
              id: '1',
              username: body.username, 
              nombre: 'Admin',
              rememberMe: body.rememberMe 
            },
            token: 'mock-token-' + Date.now()
          }
        });
      }
      
      return HttpResponse.json({
        success: false,
        error: 'Credenciales incorrectas'
      }, { status: 401 });
    } catch (error) {
      return HttpResponse.json({
        success: false,
        error: 'Error procesando login'
      }, { status: 500 });
    }
  }),

  // FUMIGACIONES CRUD
  http.get('/api/fumigaciones', async () => {
    await delay();
    return HttpResponse.json({
      success: true,
      data: fumigaciones,
      pagination: { page: 1, limit: 10, total: fumigaciones.length }
    });
  }),

  http.get('/api/fumigaciones/:id', async ({ params }) => {
    await delay();
    const fumigacion = fumigaciones.find(f => f.id === params.id);
    
    if (!fumigacion) {
      return HttpResponse.json({ 
        success: false, 
        error: 'Fumigación no encontrada' 
      }, { status: 404 });
    }
    
    return HttpResponse.json({ 
      success: true, 
      data: fumigacion 
    });
  }),

  http.post('/api/fumigaciones', async ({ request }) => {
    await delay();
    
    try {
      const body = await request.json() as any;
      const newFumigacion = {
        ...body,
        id: Date.now().toString(),
      };
      fumigaciones.unshift(newFumigacion);
      
      return HttpResponse.json({ 
        success: true, 
        message: 'Fumigación creada exitosamente',
        data: newFumigacion 
      }, { status: 201 });
    } catch (error) {
      return HttpResponse.json({
        success: false,
        error: 'Error creando fumigación'
      }, { status: 500 });
    }
  }),

  http.put('/api/fumigaciones/:id', async ({ params, request }) => {
    await delay();
    
    try {
      const body = await request.json() as any;
      const index = fumigaciones.findIndex(f => f.id === params.id);
      
      if (index === -1) {
        return HttpResponse.json({ 
          success: false, 
          error: 'Fumigación no encontrada' 
        }, { status: 404 });
      }
      
      fumigaciones[index] = { ...fumigaciones[index], ...body };
      
      return HttpResponse.json({ 
        success: true, 
        message: 'Fumigación actualizada',
        data: fumigaciones[index] 
      });
    } catch (error) {
      return HttpResponse.json({
        success: false,
        error: 'Error actualizando fumigación'
      }, { status: 500 });
    }
  }),

  http.delete('/api/fumigaciones/:id', async ({ params }) => {
    await delay();
    
    const index = fumigaciones.findIndex(f => f.id === params.id);
    
    if (index === -1) {
      return HttpResponse.json({ 
        success: false, 
        error: 'Fumigación no encontrada' 
      }, { status: 404 });
    }
    
    fumigaciones.splice(index, 1);
    
    return HttpResponse.json({ 
      success: true, 
      message: 'Fumigación eliminada' 
    });
  }),

  // LOTES CRUD
  http.get('/api/lotes', async () => {
    await delay();
    return HttpResponse.json({
      success: true,
      data: lotes,
      pagination: { page: 1, limit: 10, total: lotes.length }
    });
  }),

  http.get('/api/lotes/:id', async ({ params }) => {
    await delay();
    const lote = lotes.find(l => l.id === params.id);
    
    if (!lote) {
      return HttpResponse.json({ 
        success: false, 
        error: 'Lote no encontrado' 
      }, { status: 404 });
    }
    
    return HttpResponse.json({ 
      success: true, 
      data: lote 
    });
  }),

  http.post('/api/lotes', async ({ request }) => {
    await delay();
    
    try {
      const body = await request.json() as any;
      const newLote = {
        ...body,
        id: Date.now().toString(),
      };
      lotes.unshift(newLote);
      
      return HttpResponse.json({ 
        success: true, 
        message: 'Lote creado exitosamente',
        data: newLote 
      }, { status: 201 });
    } catch (error) {
      return HttpResponse.json({
        success: false,
        error: 'Error creando lote'
      }, { status: 500 });
    }
  })
];