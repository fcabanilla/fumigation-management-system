// ==================== DEMO DEL SISTEMA DE VALIDACIÓN ====================

/**
 * Componente de demostración del sistema completo de validación avanzada
 * Muestra el formulario integrado con validación en tiempo real y carga de trabajos pasados
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FaRocket,
  FaCheckCircle,
  FaLightbulb,
  FaHistory,
} from 'react-icons/fa';
import FumigacionFormAdvanced from './FumigacionFormAdvanced';
import { Fumigacion } from './FumigacionesList';

// ==================== TYPE FIXES ====================

const RocketIcon = FaRocket as React.ComponentType<{ size?: number }>;
const CheckIcon = FaCheckCircle as React.ComponentType<{ size?: number }>;
const LightbulbIcon = FaLightbulb as React.ComponentType<{ size?: number }>;
const HistoryIcon = FaHistory as React.ComponentType<{ size?: number }>;

// ==================== STYLED COMPONENTS ====================

const DemoContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const DemoHeader = styled.div`
  background: linear-gradient(135deg, #4a7c59, #2d5016);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;

  h1 {
    margin: 0 0 10px 0;
    font-size: 2.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }

  p {
    margin: 0;
    font-size: 1.1rem;
    opacity: 0.9;
    line-height: 1.5;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const FeatureCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;

  .icon {
    color: #4a7c59;
    margin-bottom: 15px;
  }

  h3 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const DemoSection = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const NotificationBar = styled.div`
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
  padding: 15px 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;

  .icon {
    color: #17a2b8;
  }
`;

// ==================== COMPONENT ====================

const ValidationDemo: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [savedFumigaciones, setSavedFumigaciones] = useState<Fumigacion[]>([]);

  const handleSaveFumigacion = (fumigacion: Fumigacion) => {
    setSavedFumigaciones(prev => [...prev, fumigacion]);
    setShowForm(false);

    // Mostrar notificación de éxito
    alert(
      `✅ Fumigación "${fumigacion.nombre}" creada exitosamente!\n\nID: ${fumigacion.id}\nCampo: ${fumigacion.campo}\nProducto: ${fumigacion.producto}\nCosto: $${fumigacion.costo.toLocaleString()}`
    );
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  if (showForm) {
    return (
      <DemoContainer>
        <FumigacionFormAdvanced
          onSave={handleSaveFumigacion}
          onCancel={handleCancelForm}
        />
      </DemoContainer>
    );
  }

  return (
    <DemoContainer>
      <DemoHeader>
        <h1>
          <RocketIcon />
          Sistema de Validación Avanzada - Demo
        </h1>
        <p>
          Pruebe el sistema completo de validación con carga de trabajos
          pasados, optimizaciones automáticas y sugerencias inteligentes para
          fumigaciones agrícolas.
        </p>
      </DemoHeader>

      <NotificationBar>
        <CheckIcon size={20} />
        <div>
          <strong>¡Fase 2 completada exitosamente!</strong> El sistema de
          validación avanzada está listo para uso.
          {savedFumigaciones.length > 0 && (
            <span>
              {' '}
              | {savedFumigaciones.length} fumigación(es) guardada(s) en esta
              sesión.
            </span>
          )}
        </div>
      </NotificationBar>

      <FeaturesGrid>
        <FeatureCard>
          <CheckIcon size={48} />
          <h3>Validación en Tiempo Real</h3>
          <p>
            Validación automática de campos, rangos de dosis, condiciones
            climáticas y reglas de negocio mientras completa el formulario.
          </p>
        </FeatureCard>

        <FeatureCard>
          <HistoryIcon size={48} />
          <h3>Carga de Trabajos Pasados</h3>
          <p>
            Busque y reutilice configuraciones de fumigaciones exitosas
            anteriores como plantillas para nuevos trabajos.
          </p>
        </FeatureCard>

        <FeatureCard>
          <LightbulbIcon size={48} />
          <h3>Sugerencias Inteligentes</h3>
          <p>
            Optimizaciones automáticas de costos, recomendaciones de condiciones
            climáticas y sugerencias de mejores prácticas.
          </p>
        </FeatureCard>
      </FeaturesGrid>

      <DemoSection>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>
            Características Implementadas
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px',
              margin: '30px 0',
              textAlign: 'left',
            }}
          >
            <div>
              <h4 style={{ color: '#4a7c59', marginBottom: '10px' }}>
                🎯 FumigacionValidator.ts
              </h4>
              <ul style={{ color: '#666', fontSize: '0.9rem' }}>
                <li>37 reglas de validación</li>
                <li>3 validaciones condicionales</li>
                <li>Estimación de costos automática</li>
                <li>Sugerencias de plantillas</li>
                <li>Mock data de trabajos pasados</li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#4a7c59', marginBottom: '10px' }}>
                🔍 ValidationPanel.tsx
              </h4>
              <ul style={{ color: '#666', fontSize: '0.9rem' }}>
                <li>Validación en tiempo real</li>
                <li>Panel de errores y warnings</li>
                <li>Sugerencias de optimización</li>
                <li>Estadísticas de costo/hectárea</li>
                <li>Integración con trabajos pasados</li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#4a7c59', marginBottom: '10px' }}>
                📋 TrabajoPasadoSelector.tsx
              </h4>
              <ul style={{ color: '#666', fontSize: '0.9rem' }}>
                <li>Búsqueda y filtrado avanzado</li>
                <li>Sugerencias automáticas</li>
                <li>Plantillas predefinidas</li>
                <li>Historial de efectividad</li>
                <li>Comparación de costos</li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#4a7c59', marginBottom: '10px' }}>
                📝 FumigacionFormAdvanced.tsx
              </h4>
              <ul style={{ color: '#666', fontSize: '0.9rem' }}>
                <li>Formulario completo integrado</li>
                <li>Validación visual de campos</li>
                <li>Rangos automáticos por producto</li>
                <li>Condiciones climáticas</li>
                <li>Panel de validación lateral</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            style={{
              background: 'linear-gradient(135deg, #4a7c59, #2d5016)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s',
              marginTop: '20px',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 8px 20px rgba(74, 124, 89, 0.3)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <RocketIcon />
            Probar Sistema Completo
          </button>

          <div
            style={{
              marginTop: '30px',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#666',
            }}
          >
            <strong>Instrucciones:</strong> Al hacer clic, se abrirá el
            formulario completo con validación en tiempo real. Pruebe completar
            campos incorrectos para ver las validaciones, use el botón "Cargar
            trabajo anterior" para explorar la funcionalidad de reutilización, y
            observe las sugerencias automáticas en el panel derecho.
          </div>
        </div>
      </DemoSection>
    </DemoContainer>
  );
};

export default ValidationDemo;
