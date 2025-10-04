// MSW Handlers básicos para MSW v1.x// handlers.ts - MSW handlers básicos para MSW v1.x

import { rest } from 'msw';import { rest } from 'msw';



export const handlers = [// Handlers básicos para auth y lotes

  // AUTH LOGIN básicoexport const handlers = [

  rest.post('/api/auth/login', (req, res, ctx) => {  // AUTH LOGIN básico

    return res(  rest.post('/api/auth/login', (req, res, ctx) => {

      ctx.delay(300),    return res(

      ctx.status(200),      ctx.delay(300),

      ctx.json({      ctx.status(200),

        success: true,      ctx.json({

        message: 'Login exitoso',        success: true,

        data: {        message: 'Login exitoso',

          user: { id: '1', username: 'admin', nombre: 'Admin' },        data: {

          token: 'mock-token'          user: { id: '1', username: 'admin', nombre: 'Admin' },

        }          token: 'mock-token'

      })        }

    );      })

  }),    );

  }),

  // LOTES básicos

  rest.get('/api/lotes', (req, res, ctx) => {  // LOTES básicos

    return res(  rest.get('/api/lotes', (req, res, ctx) => {

      ctx.delay(300),    return res(

      ctx.status(200),      ctx.delay(300),

      ctx.json({      ctx.status(200),

        success: true,      ctx.json({

        data: [{        success: true,

          id: '1',        data: [{

          nombre: 'Campo Norte Principal',          id: '1',

          hectareas: 45.5,          nombre: 'Campo Norte Principal',

          cultivo: 'Soja'          hectareas: 45.5,

        }]          cultivo: 'Soja'

      })        }]

    );      })

  }),    );

  }),

  // FUMIGACIONES básicas

  rest.get('/api/fumigaciones', (req, res, ctx) => {  // FUMIGACIONES básicas

    return res(  rest.get('/api/fumigaciones', (req, res, ctx) => {

      ctx.delay(300),    return res(

      ctx.status(200),      ctx.delay(300),

      ctx.json({      ctx.status(200),

        data: [{      ctx.json({

          id: "fum-001",        data: [{

          nombre: "Fumigación Campo Norte",          id: "fum-001",

          campo: "Campo Norte",          nombre: "Fumigación Campo Norte",

          estado: "Completada"          campo: "Campo Norte",

        }],          estado: "Completada"

        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }        }],

      })        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }

    );      })

  }),    );

  }),

  rest.get('/api/fumigaciones/stats', (req, res, ctx) => {

    return res(  rest.get('/api/fumigaciones/stats', (req, res, ctx) => {

      ctx.delay(200),    return res(

      ctx.status(200),      ctx.delay(200),

      ctx.json({      ctx.status(200),

        total: 1,      ctx.json({

        porEstado: { Completada: 1 },        total: 1,

        superficieTotal: 25.5,        porEstado: { Completada: 1 },

        porTipoTratamiento: { Preventivo: 1 }        superficieTotal: 25.5,

      })        porTipoTratamiento: { Preventivo: 1 }

    );      })

  })    );

];  })
];

// In-memory storage simple para lotes (mantenemos compatibilidad)
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

// Handlers básicos para auth y lotes (mantener compatibilidad)
const basicHandlers = [
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

  // LOTES CRUD (mantenemos para compatibilidad)
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

// Combinar handlers básicos con el sistema avanzado de fumigaciones
export const handlers = [
  ...basicHandlers,
  ...fumigacionesHandlers
];