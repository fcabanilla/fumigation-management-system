// msw-setup.js - Configuración MSW simple
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// Función para inicializar MSW
export async function enableMocking() {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return;
  }

  return worker.start({
    onUnhandledRequest(req, print) {
      // Ignorar WebSocket requests del dev server
      if (req.url.pathname === '/ws') {
        return;
      }
      // Mostrar warning para otras requests no manejadas
      print.warning();
    },
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}
