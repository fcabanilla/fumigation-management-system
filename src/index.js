import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { enableMocking } from './mocks/msw-setup';

// Inicializar MSW antes de renderizar App (TEMPORALMENTE DESACTIVADO)
async function startApp() {
  // Desactivar MSW temporalmente para solucionar problemas de compatibilidad
  // if (process.env.NODE_ENV === 'development') {
  //   await enableMocking();
  // }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

startApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
