import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  FaUser,
  FaEnvelope,
  FaClock,
  FaEdit,
  FaSave,
  FaTimes,
  FaUserCircle,
  FaCog,
} from 'react-icons/fa';
import { GiSpray } from 'react-icons/gi';

const ProfileContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f0f8f0;
  padding-bottom: 1rem;
`;

const ProfileTitle = styled.h2`
  color: #2d5016;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
`;

const EditButton = styled.button`
  background: ${(props) => (props.isEditing ? '#dc3545' : '#4a7c59')};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  box-shadow: 0 8px 25px rgba(74, 124, 89, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const UserRole = styled.div`
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoField = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fdf8;
  border-radius: 10px;
  border-left: 4px solid #4a7c59;
`;

const FieldIcon = styled.div`
  color: #4a7c59;
  font-size: 1.2rem;
  min-width: 20px;
`;

const FieldContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FieldLabel = styled.label`
  color: #666;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FieldValue = styled.div`
  color: #2d5016;
  font-weight: 600;
  font-size: 1rem;
`;

const FieldInput = styled.input`
  color: #2d5016;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  background: transparent;
  padding: 0.25rem 0;
  border-bottom: 2px solid #4a7c59;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-bottom-color: #6b8e23;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(74, 124, 89, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(74, 124, 89, 0.1);
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d5016;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const UserProfile = ({ user, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {});

  // Datos por defecto si no hay usuario
  const defaultUser = {
    username: 'admin',
    email: 'admin@fumigacion.com',
    displayName: 'Administrador',
    role: 'Administrador',
    lastLogin: new Date().toISOString(),
    joinDate: '2024-01-15',
    preferences: {
      theme: 'light',
      notifications: true,
    },
  };

  const currentUser = { ...defaultUser, ...user };

  const handleEdit = () => {
    if (isEditing) {
      // Guardar cambios
      const updatedUser = {
        ...currentUser,
        ...editedUser,
        lastModified: new Date().toISOString(),
      };

      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      setIsEditing(false);
    } else {
      // Entrar en modo edición
      setEditedUser(currentUser);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditedUser(currentUser);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const userStats = [
    { label: 'Días Activo', value: '142' },
    { label: 'Fumigaciones', value: '89' },
    { label: 'Hectáreas', value: '456' },
    { label: 'Reportes', value: '23' },
  ];

  const displayUser = isEditing ? editedUser : currentUser;

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>
          <FaUserCircle />
          Perfil de Usuario
        </ProfileTitle>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isEditing && (
            <EditButton onClick={handleCancel} isEditing={true}>
              <FaTimes />
              Cancelar
            </EditButton>
          )}
          <EditButton onClick={handleEdit} isEditing={false}>
            {isEditing ? <FaSave /> : <FaEdit />}
            {isEditing ? 'Guardar' : 'Editar'}
          </EditButton>
        </div>
      </ProfileHeader>

      <ProfileContent>
        <AvatarSection>
          <Avatar>
            <FaUser />
          </Avatar>
          <UserRole>{displayUser.role || 'Usuario'}</UserRole>
        </AvatarSection>

        <InfoSection>
          <InfoGroup>
            <InfoField>
              <FieldIcon>
                <FaUser />
              </FieldIcon>
              <FieldContent>
                <FieldLabel>Nombre de Usuario</FieldLabel>
                {isEditing ? (
                  <FieldInput
                    type="text"
                    value={displayUser.username || ''}
                    onChange={(e) =>
                      handleInputChange('username', e.target.value)
                    }
                  />
                ) : (
                  <FieldValue>{displayUser.username}</FieldValue>
                )}
              </FieldContent>
            </InfoField>

            <InfoField>
              <FieldIcon>
                <FaUser />
              </FieldIcon>
              <FieldContent>
                <FieldLabel>Nombre Completo</FieldLabel>
                {isEditing ? (
                  <FieldInput
                    type="text"
                    value={displayUser.displayName || ''}
                    onChange={(e) =>
                      handleInputChange('displayName', e.target.value)
                    }
                  />
                ) : (
                  <FieldValue>
                    {displayUser.displayName || displayUser.username}
                  </FieldValue>
                )}
              </FieldContent>
            </InfoField>

            <InfoField>
              <FieldIcon>
                <FaEnvelope />
              </FieldIcon>
              <FieldContent>
                <FieldLabel>Correo Electrónico</FieldLabel>
                {isEditing ? (
                  <FieldInput
                    type="email"
                    value={displayUser.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <FieldValue>{displayUser.email}</FieldValue>
                )}
              </FieldContent>
            </InfoField>

            <InfoField>
              <FieldIcon>
                <FaClock />
              </FieldIcon>
              <FieldContent>
                <FieldLabel>Último Acceso</FieldLabel>
                <FieldValue>
                  {formatTime(displayUser.lastLogin || new Date())}
                </FieldValue>
              </FieldContent>
            </InfoField>

            <InfoField>
              <FieldIcon>
                <GiSpray />
              </FieldIcon>
              <FieldContent>
                <FieldLabel>Miembro Desde</FieldLabel>
                <FieldValue>
                  {formatDate(displayUser.joinDate || '2024-01-15')}
                </FieldValue>
              </FieldContent>
            </InfoField>
          </InfoGroup>

          <InfoGroup>
            <FieldLabel style={{ marginBottom: '0.5rem', marginLeft: '0' }}>
              <FaCog style={{ marginRight: '0.5rem' }} />
              Estadísticas de Actividad
            </FieldLabel>
            <StatsGrid>
              {userStats.map((stat, index) => (
                <StatItem key={index}>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                </StatItem>
              ))}
            </StatsGrid>
          </InfoGroup>
        </InfoSection>
      </ProfileContent>
    </ProfileContainer>
  );
};

UserProfile.propTypes = {
  user: PropTypes.object,
  onUserUpdate: PropTypes.func,
};

export default UserProfile;
