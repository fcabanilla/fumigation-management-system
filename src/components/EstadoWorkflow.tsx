import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FaChevronDown,
  FaCheck,
  FaPlay,
  FaPause,
  FaTimes,
  FaHistory,
} from 'react-icons/fa';
import {
  FumigacionEstado,
  fumigacionStateMachine,
  getColorEstado,
  getIconoEstado,
  getDescripcionEstado,
  TransicionRazon,
  HistorialEstado,
} from '../utils/FumigacionStateMachine';

// ==================== TYPE FIXES ====================

// Fix para react-icons
const ChevronDownIcon = FaChevronDown as React.ComponentType<{ size?: number }>;
const HistoryIcon = FaHistory as React.ComponentType<{ size?: number }>;

// ==================== INTERFACES ====================

export interface EstadoWorkflowProps {
  fumigacion: any;
  onEstadoChange?: (
    fumigacion: any,
    nuevoEstado: FumigacionEstado
  ) => Promise<void>;
  readonly?: boolean;
  mostrarHistorial?: boolean;
  usuario?: any;
}

// ==================== STYLED COMPONENTS ====================

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const EstadoBadge = styled.button<{
  estado: FumigacionEstado;
  clickable: boolean;
  size?: 'small' | 'medium' | 'large';
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${props => {
    switch (props.size) {
      case 'small':
        return '4px 8px';
      case 'large':
        return '10px 16px';
      default:
        return '6px 12px';
    }
  }};
  background: ${props => getColorEstado(props.estado)};
  color: white;
  border: none;
  border-radius: 20px;
  font-size: ${props => {
    switch (props.size) {
      case 'small':
        return '0.75rem';
      case 'large':
        return '0.95rem';
      default:
        return '0.85rem';
    }
  }};
  font-weight: 600;
  cursor: ${props => (props.clickable ? 'pointer' : 'default')};
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    ${props =>
      props.clickable &&
      `
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `}
  }

  &:active {
    transform: translateY(0);
  }
`;

const DropdownIcon = styled.div<{ open: boolean }>`
  transition: transform 0.2s ease;
  transform: ${props => (props.open ? 'rotate(180deg)' : 'rotate(0deg)')};
  margin-left: 4px;
  display: inline-flex;
  align-items: center;
`;

const DropdownMenu = styled.div<{ show: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  max-height: ${props => (props.show ? '400px' : '0')};
  opacity: ${props => (props.show ? '1' : '0')};
  transform: ${props => (props.show ? 'translateY(0)' : 'translateY(-10px)')};
  transition: all 0.3s ease;
  border: 1px solid #e1e8ed;
  min-width: 250px;
`;

const MenuSection = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f4;

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.div`
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AccionItem = styled.button<{
  disponible: boolean;
  tipo?: 'principal' | 'peligroso';
}>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  background: ${props =>
    props.disponible
      ? props.tipo === 'peligroso'
        ? '#ffeaa7'
        : 'transparent'
      : '#f8f9fa'};
  color: ${props =>
    props.disponible
      ? props.tipo === 'peligroso'
        ? '#d63031'
        : '#2c3e50'
      : '#95a5a6'};
  cursor: ${props => (props.disponible ? 'pointer' : 'not-allowed')};
  text-align: left;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => {
      if (!props.disponible) return '#f8f9fa';
      if (props.tipo === 'peligroso') return '#fdcb6e';
      return '#f1f3f4';
    }};
  }
`;

const AccionIcon = styled.span<{ color: string }>`
  color: ${props => props.color};
  font-size: 0.9rem;
  min-width: 16px;
`;

const AccionTexto = styled.div`
  flex: 1;
`;

const AccionDescripcion = styled.div`
  font-size: 0.75rem;
  color: #7f8c8d;
  margin-top: 2px;
`;

const HistorialContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const HistorialItem = styled.div`
  padding: 8px 16px;
  font-size: 0.8rem;
  border-bottom: 1px solid #f8f9fa;

  &:last-child {
    border-bottom: none;
  }
`;

const HistorialFecha = styled.div`
  color: #7f8c8d;
  font-size: 0.7rem;
`;

const HistorialCambio = styled.div`
  color: #2c3e50;
  font-weight: 500;
  margin: 2px 0;
`;

const HistorialUsuario = styled.div`
  color: #34495e;
  font-size: 0.75rem;
`;

const ConfirmDialog = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ConfirmContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const ConfirmTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 1.2rem;
`;

const ConfirmInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  resize: vertical;
  margin-bottom: 16px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4a7c59;
  }
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ConfirmButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  background: ${props => (props.variant === 'primary' ? '#4a7c59' : '#6c757d')};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

const EstadoDescripcion = styled.div`
  padding: 8px 16px;
  font-size: 0.9rem;
  color: #34495e;
`;

const ClickOutside = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

const HistoryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// ==================== MAIN COMPONENT ====================

const EstadoWorkflow: React.FC<EstadoWorkflowProps> = ({
  fumigacion,
  onEstadoChange,
  readonly = false,
  mostrarHistorial = true,
  usuario,
}) => {
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accionSeleccionada, setAccionSeleccionada] = useState<{
    estado: FumigacionEstado;
    accion: string;
  } | null>(null);
  const [motivoCambio, setMotivoCambio] = useState('');

  const estadoActual = fumigacion.estado as FumigacionEstado;
  const acciones = fumigacionStateMachine.getAccionesDisponibles(
    estadoActual,
    fumigacion,
    usuario
  );
  const historial = fumigacionStateMachine.getHistorialFumigacion(
    fumigacion.id
  );

  const handleAccionClick = (accion: any) => {
    if (!accion.disponible) return;

    setAccionSeleccionada(accion);
    setShowConfirm(true);
    setDropdownAbierto(false);
  };

  const confirmarCambio = async () => {
    if (!accionSeleccionada || !onEstadoChange) return;

    const razon: TransicionRazon = {
      motivo: accionSeleccionada.accion,
      usuario: usuario?.nombre || 'Usuario',
      timestamp: new Date().toISOString(),
      observaciones: motivoCambio || undefined,
    };

    try {
      const resultado = await fumigacionStateMachine.ejecutarTransicion(
        fumigacion,
        accionSeleccionada.estado,
        razon
      );

      if (resultado.exito) {
        const fumigacionActualizada = {
          ...fumigacion,
          estado: accionSeleccionada.estado,
          updatedAt: new Date().toISOString(),
        };

        await onEstadoChange(fumigacionActualizada, accionSeleccionada.estado);
      } else {
        alert(`Error: ${resultado.mensaje}`);
      }
    } catch (error) {
      console.error('Error ejecutando transición:', error);
      alert('Error inesperado al cambiar estado');
    }

    setShowConfirm(false);
    setAccionSeleccionada(null);
    setMotivoCambio('');
  };

  const getAccionIcon = (accion: string): string => {
    const iconos: Record<string, string> = {
      'Iniciar Fumigación': '▶️',
      'Solicitar Aprobación': '📤',
      Cancelar: '❌',
      Aprobar: '✅',
      'Aprobar e Iniciar': '🚀',
      Rechazar: '❌',
      Pausar: '⏸️',
      Completar: '✅',
      Reanudar: '▶️',
    };
    return iconos[accion] || '🔄';
  };

  const getTipoAccion = (
    estadoDestino: FumigacionEstado
  ): 'principal' | 'peligroso' | undefined => {
    if (estadoDestino === 'Cancelada') return 'peligroso';
    if (estadoDestino === 'Completada' || estadoDestino === 'En Proceso')
      return 'principal';
    return undefined;
  };

  // Si es readonly, solo mostrar el badge sin interactividad
  if (readonly) {
    return (
      <EstadoBadge estado={estadoActual} clickable={false} as="div">
        {getIconoEstado(estadoActual)} {estadoActual}
      </EstadoBadge>
    );
  }

  return (
    <Container>
      <EstadoBadge
        estado={estadoActual}
        clickable={acciones.length > 0}
        onClick={() =>
          acciones.length > 0 && setDropdownAbierto(!dropdownAbierto)
        }
      >
        {getIconoEstado(estadoActual)} {estadoActual}
        {acciones.length > 0 && (
          <DropdownIcon open={dropdownAbierto}>
            <ChevronDownIcon />
          </DropdownIcon>
        )}
      </EstadoBadge>

      <DropdownMenu show={dropdownAbierto}>
        {/* Estado Actual */}
        <MenuSection>
          <SectionTitle>Estado Actual</SectionTitle>
          <EstadoDescripcion>
            {getDescripcionEstado(estadoActual)}
          </EstadoDescripcion>
        </MenuSection>

        {/* Acciones Disponibles */}
        {acciones.length > 0 && (
          <MenuSection>
            <SectionTitle>Acciones Disponibles</SectionTitle>
            {acciones.map((accion, index) => (
              <AccionItem
                key={index}
                disponible={accion.disponible}
                tipo={getTipoAccion(accion.estado)}
                onClick={() => handleAccionClick(accion)}
                disabled={!accion.disponible}
              >
                <AccionIcon color={getColorEstado(accion.estado)}>
                  {getAccionIcon(accion.accion)}
                </AccionIcon>
                <AccionTexto>
                  <div>{accion.accion}</div>
                  <AccionDescripcion>
                    {accion.disponible ? accion.descripcion : accion.razon}
                  </AccionDescripcion>
                </AccionTexto>
              </AccionItem>
            ))}
          </MenuSection>
        )}

        {/* Historial */}
        {mostrarHistorial && historial.length > 0 && (
          <MenuSection>
            <HistoryTitle>
              <HistoryIcon />
              Historial de Cambios
            </HistoryTitle>
            <HistorialContainer>
              {historial.slice(0, 5).map((item: HistorialEstado) => (
                <HistorialItem key={item.id}>
                  <HistorialCambio>
                    {item.estadoAnterior} → {item.estadoNuevo}
                  </HistorialCambio>
                  <HistorialUsuario>{item.razon.usuario}</HistorialUsuario>
                  <HistorialFecha>
                    {new Date(item.timestamp).toLocaleString('es-ES')}
                  </HistorialFecha>
                </HistorialItem>
              ))}
            </HistorialContainer>
          </MenuSection>
        )}
      </DropdownMenu>

      {/* Dialog de Confirmación */}
      <ConfirmDialog show={showConfirm}>
        <ConfirmContent>
          <ConfirmTitle>Confirmar: {accionSeleccionada?.accion}</ConfirmTitle>
          <p>
            ¿Estás seguro de que deseas cambiar el estado de la fumigación a{' '}
            <strong>{accionSeleccionada?.estado}</strong>?
          </p>
          <ConfirmInput
            placeholder="Motivo del cambio (opcional)..."
            value={motivoCambio}
            onChange={e => setMotivoCambio(e.target.value)}
          />
          <ConfirmButtons>
            <ConfirmButton
              variant="secondary"
              onClick={() => {
                setShowConfirm(false);
                setAccionSeleccionada(null);
                setMotivoCambio('');
              }}
            >
              Cancelar
            </ConfirmButton>
            <ConfirmButton variant="primary" onClick={confirmarCambio}>
              Confirmar
            </ConfirmButton>
          </ConfirmButtons>
        </ConfirmContent>
      </ConfirmDialog>

      {/* Click fuera para cerrar dropdown */}
      {dropdownAbierto && (
        <ClickOutside onClick={() => setDropdownAbierto(false)} />
      )}
    </Container>
  );
};

export default EstadoWorkflow;
