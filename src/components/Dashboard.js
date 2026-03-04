import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  FaCog,
  FaChartBar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSignOutAlt,
} from 'react-icons/fa';
import { GiSpray, GiPlantSeed } from 'react-icons/gi';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 100%);
`;

const Header = styled.header`
  background: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 600;
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const WelcomeSection = styled.section`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const WelcomeTitle = styled.h1`
  color: #2d5016;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
`;

const WelcomeSubtitle = styled.p`
  color: #666;
  margin: 0;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  color: ${(props) => props.color || '#4a7c59'};
  background: ${(props) => props.bgColor || 'rgba(74, 124, 89, 0.1)'};
  padding: 1rem;
  border-radius: 12px;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #2d5016;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ActionCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ActionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ActionIcon = styled.div`
  font-size: 1.5rem;
  color: #4a7c59;
`;

const ActionTitle = styled.h3`
  color: #2d5016;
  margin: 0;
  font-size: 1.2rem;
`;

const ActionDescription = styled.p`
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(74, 124, 89, 0.3);
  }
`;

const Dashboard = ({ user, onLogout }) => {
  const handleFeatureClick = (featureName) => {
    // En una aplicación real, aquí navegaríamos a la página correspondiente
    // eslint-disable-next-line no-alert
    alert(`Función en desarrollo: ${featureName}`);
  };

  const stats = [
    {
      icon: GiSpray,
      value: '24',
      label: 'Fumigaciones Programadas',
      color: '#4a7c59',
      bgColor: 'rgba(74, 124, 89, 0.1)',
    },
    {
      icon: GiPlantSeed,
      value: '156',
      label: 'Hectáreas Tratadas',
      color: '#6b8e23',
      bgColor: 'rgba(107, 142, 35, 0.1)',
    },
    {
      icon: FaChartBar,
      value: '89%',
      label: 'Efectividad Promedio',
      color: '#2e7d32',
      bgColor: 'rgba(46, 125, 50, 0.1)',
    },
    {
      icon: FaCalendarAlt,
      value: '12',
      label: 'Tareas Pendientes',
      color: '#f57c00',
      bgColor: 'rgba(245, 124, 0, 0.1)',
    },
  ];

  const actions = [
    {
      icon: FaCalendarAlt,
      title: 'Programar Fumigación',
      description:
        'Planifica nuevas tareas de fumigación para tus cultivos y establece fechas de aplicación.',
      action: () => handleFeatureClick('Programar Fumigación'),
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Ver Mapa de Campos',
      description:
        'Visualiza todos tus campos y el estado actual de las fumigaciones en curso.',
      action: () => handleFeatureClick('Ver Mapa de Campos'),
    },
    {
      icon: FaChartBar,
      title: 'Reportes y Análisis',
      description:
        'Genera reportes detallados sobre la efectividad y costos de tus fumigaciones.',
      action: () => handleFeatureClick('Reportes y Análisis'),
    },
    {
      icon: FaCog,
      title: 'Configuración',
      description:
        'Ajusta las configuraciones del sistema, usuarios y parámetros de fumigación.',
      action: () => handleFeatureClick('Configuración'),
    },
  ];

  return (
    <DashboardContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <GiSpray />
            AgriControl Pro
          </Logo>
          <LogoutButton onClick={onLogout}>
            <FaSignOutAlt />
            Cerrar Sesión
          </LogoutButton>
        </HeaderContent>
      </Header>

      <Main>
        <WelcomeSection>
          <WelcomeTitle>¡Bienvenido de vuelta!</WelcomeTitle>
          <WelcomeSubtitle>
            Aquí tienes un resumen de tu sistema de gestión de fumigación.
          </WelcomeSubtitle>
        </WelcomeSection>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatIcon color={stat.color} bgColor={stat.bgColor}>
                <stat.icon />
              </StatIcon>
              <StatInfo>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatInfo>
            </StatCard>
          ))}
        </StatsGrid>

        <ActionsGrid>
          {actions.map((action, index) => (
            <ActionCard key={index}>
              <ActionHeader>
                <ActionIcon>
                  <action.icon />
                </ActionIcon>
                <ActionTitle>{action.title}</ActionTitle>
              </ActionHeader>
              <ActionDescription>{action.description}</ActionDescription>
              <ActionButton onClick={action.action}>Acceder</ActionButton>
            </ActionCard>
          ))}
        </ActionsGrid>
      </Main>
    </DashboardContainer>
  );
};

Dashboard.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
};

export default Dashboard;
