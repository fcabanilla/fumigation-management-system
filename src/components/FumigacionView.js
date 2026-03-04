import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useLotes } from '../hooks/useLotes';
import LotePreview from './LotePreview';
import {
  FaTimes,
  FaEdit,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
  FaUser,
  FaTools,
  FaClock,
  FaEye,
} from 'react-icons/fa';
import { GiSpray } from 'react-icons/gi';

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  width: 100%;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  padding: 2rem;
  color: white;
  position: relative;
  border-radius: 20px 20px 0 0;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.6rem;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const HeaderButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.6rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  transition: all 0.3s ease;
  font-size: 1.1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  &.close {
    background: rgba(244, 67, 54, 0.8);
  }

  &.close:hover {
    background: rgba(244, 67, 54, 1);
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(props) => props.background || '#e0e0e0'};
  color: ${(props) => props.color || '#666'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const ModalBody = styled.div`
  padding: 2.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: 2rem;
`;

const InfoSection = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1.5rem;
  border-left: 4px solid #4a7c59;
`;

const SectionTitle = styled.h3`
  color: #2d5016;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const InfoIcon = styled.div`
  color: #4a7c59;
  margin-top: 0.15rem;
  min-width: 16px;
  display: flex;
  align-items: center;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  color: #2d5016;
  font-weight: 500;
  font-size: 0.95rem;
  word-break: break-word;
`;

const ObservacionesSection = styled.div`
  background: #fff8e1;
  border-radius: 15px;
  padding: 1.5rem;
  border-left: 4px solid #ffa000;
  margin-bottom: 2rem;
`;

const ObservacionesTitle = styled.h3`
  color: #e65100;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
`;

const ObservacionesText = styled.p`
  color: #bf360c;
  margin: 0;
  line-height: 1.6;
  font-style: italic;
`;

const EmptyObservaciones = styled.div`
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 1rem;
`;

const ModalFooter = styled.div`
  padding: 1.5rem 2.5rem;
  background: #f8f9fa;
  border-radius: 0 0 20px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(74, 124, 89, 0.3);

  &:hover {
    box-shadow: 0 6px 25px rgba(74, 124, 89, 0.4);
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #666;
  border: 2px solid #e0e0e0;

  &:hover {
    background: #f5f5f5;
  }
`;

// Estados de fumigación
const ESTADOS_FUMIGACION = {
  PLANIFICADA: {
    label: 'Planificada',
    color: '#fff',
    background: '#2196f3',
  },
  EN_PROCESO: {
    label: 'En Proceso',
    color: '#fff',
    background: '#ff9800',
  },
  COMPLETADA: {
    label: 'Completada',
    color: '#fff',
    background: '#4caf50',
  },
  CANCELADA: {
    label: 'Cancelada',
    color: '#fff',
    background: '#f44336',
  },
};

const FumigacionView = ({ fumigacion, onEdit, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const { lotes } = useLotes();

  // Función para encontrar lote por nombre de campo
  const findLoteByNombre = (nombreCampo) => {
    return lotes.find(
      (lote) =>
        lote.nombre.toLowerCase() === nombreCampo.toLowerCase() ||
        lote.nombre.toLowerCase().includes(nombreCampo.toLowerCase())
    );
  };

  if (!fumigacion) {
    return null;
  }

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 200);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(fumigacion);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'No definida';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) {
      return 'No definida';
    }
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) {
      return 'No especificado';
    }
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const estado =
    ESTADOS_FUMIGACION[fumigacion.estado] || ESTADOS_FUMIGACION.PLANIFICADA;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: isClosing
            ? 'translateY(20px) scale(0.95)'
            : 'translateY(0) scale(1)',
          opacity: isClosing ? 0 : 1,
          transition: 'all 0.2s ease-out',
        }}
      >
        <ModalHeader>
          <StatusBadge background={estado.background} color={estado.color}>
            {estado.label}
          </StatusBadge>

          <HeaderContent>
            <TitleSection>
              <Title>
                <GiSpray />
                {fumigacion.nombre}
              </Title>
              <Subtitle>{fumigacion.campo}</Subtitle>
            </TitleSection>

            <HeaderActions>
              <HeaderButton onClick={handleEdit} title="Editar fumigación">
                <FaEdit />
              </HeaderButton>
              <HeaderButton
                onClick={handleClose}
                className="close"
                title="Cerrar"
              >
                <FaTimes />
              </HeaderButton>
            </HeaderActions>
          </HeaderContent>
        </ModalHeader>

        <ModalBody>
          <InfoGrid>
            {/* Información del Lote */}
            <InfoSection>
              <SectionTitle>
                <FaMapMarkerAlt />
                Información del Lote
              </SectionTitle>
              {findLoteByNombre(fumigacion.campo) ? (
                <LotePreview
                  lote={findLoteByNombre(fumigacion.campo)}
                  compact={false}
                  showMap={true}
                  mapHeight="300px"
                />
              ) : (
                <InfoList>
                  <InfoItem>
                    <InfoIcon>
                      <FaMapMarkerAlt />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Campo</InfoLabel>
                      <InfoValue>
                        {fumigacion.campo} (lote no encontrado)
                      </InfoValue>
                    </InfoContent>
                  </InfoItem>
                </InfoList>
              )}
            </InfoSection>

            {/* Información General */}
            <InfoSection>
              <SectionTitle>
                <FaEye />
                Información General
              </SectionTitle>
              <InfoList>
                <InfoItem>
                  <InfoIcon>🌿</InfoIcon>
                  <InfoContent>
                    <InfoLabel>Tipo de Tratamiento</InfoLabel>
                    <InfoValue>{fumigacion.tipoTratamiento}</InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>💊</InfoIcon>
                  <InfoContent>
                    <InfoLabel>Producto</InfoLabel>
                    <InfoValue>{fumigacion.producto}</InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>⚗️</InfoIcon>
                  <InfoContent>
                    <InfoLabel>Dosis</InfoLabel>
                    <InfoValue>{fumigacion.dosis} L/ha</InfoValue>
                  </InfoContent>
                </InfoItem>
              </InfoList>
            </InfoSection>

            {/* Detalles Técnicos */}
            <InfoSection>
              <SectionTitle>
                <FaTools />
                Detalles Técnicos
              </SectionTitle>
              <InfoList>
                <InfoItem>
                  <InfoIcon>📏</InfoIcon>
                  <InfoContent>
                    <InfoLabel>Hectáreas</InfoLabel>
                    <InfoValue>{fumigacion.hectareas} ha</InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <FaDollarSign />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Costo</InfoLabel>
                    <InfoValue>{formatCurrency(fumigacion.costo)}</InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <FaUser />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Responsable</InfoLabel>
                    <InfoValue>{fumigacion.responsable}</InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <FaTools />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Equipo Utilizado</InfoLabel>
                    <InfoValue>{fumigacion.equipoUtilizado}</InfoValue>
                  </InfoContent>
                </InfoItem>
              </InfoList>
            </InfoSection>

            {/* Fechas */}
            <InfoSection>
              <SectionTitle>
                <FaCalendarAlt />
                Cronograma
              </SectionTitle>
              <InfoList>
                <InfoItem>
                  <InfoIcon>
                    <FaClock />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Fecha Planificada</InfoLabel>
                    <InfoValue>
                      {formatDate(fumigacion.fechaPlanificada)}
                    </InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>✅</InfoIcon>
                  <InfoContent>
                    <InfoLabel>Fecha Realizada</InfoLabel>
                    <InfoValue>
                      {fumigacion.fechaRealizada
                        ? formatDate(fumigacion.fechaRealizada)
                        : 'Pendiente de realizar'}
                    </InfoValue>
                  </InfoContent>
                </InfoItem>
              </InfoList>
            </InfoSection>

            {/* Metadatos */}
            <InfoSection>
              <SectionTitle>
                <FaClock />
                Historial
              </SectionTitle>
              <InfoList>
                <InfoItem>
                  <InfoIcon>📝</InfoIcon>
                  <InfoContent>
                    <InfoLabel>Creado</InfoLabel>
                    <InfoValue>
                      {formatDateTime(fumigacion.createdAt)}
                    </InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>🔄</InfoIcon>
                  <InfoContent>
                    <InfoLabel>Última Actualización</InfoLabel>
                    <InfoValue>
                      {formatDateTime(fumigacion.updatedAt)}
                    </InfoValue>
                  </InfoContent>
                </InfoItem>
              </InfoList>
            </InfoSection>
          </InfoGrid>

          {/* Observaciones */}
          <ObservacionesSection>
            <ObservacionesTitle>📋 Observaciones</ObservacionesTitle>
            {fumigacion.observaciones ? (
              <ObservacionesText>{fumigacion.observaciones}</ObservacionesText>
            ) : (
              <EmptyObservaciones>
                No hay observaciones registradas para esta fumigación.
              </EmptyObservaciones>
            )}
          </ObservacionesSection>
        </ModalBody>

        <ModalFooter>
          <SecondaryButton onClick={handleClose}>
            <FaTimes />
            Cerrar
          </SecondaryButton>

          <PrimaryButton onClick={handleEdit}>
            <FaEdit />
            Editar Fumigación
          </PrimaryButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

FumigacionView.propTypes = {
  fumigacion: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

export default FumigacionView;
