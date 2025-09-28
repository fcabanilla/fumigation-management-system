import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FaChartBar, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { GiSpray, GiPlantSeed, GiWheat } from "react-icons/gi";
import { useTheme } from "../contexts/ThemeContext";
import UserProfile from "./UserProfile";
import FumigacionManager from "./FumigacionManager";
import LoteManager from "./LoteManager";
import Navbar from "./Navbar";
import ReportesAnalytics from "./ReportesAnalytics";
import MapaFumigacionesGeoespacial from "./MapaFumigacionesGeoespacial";

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${(props) => props.theme.colors.backgroundGradient};
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const WelcomeSection = styled.section`
  background: ${(props) => props.theme.colors.surface};
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px ${(props) => props.theme.colors.shadow};
`;

const WelcomeTitle = styled.h1`
  color: ${(props) => props.theme.colors.primary};
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
`;

const WelcomeSubtitle = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
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
  background: ${(props) => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px ${(props) => props.theme.colors.shadow};
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
  color: ${(props) => props.color || "#4a7c59"};
  background: ${(props) => props.bgColor || "rgba(74, 124, 89, 0.1)"};
  padding: 1rem;
  border-radius: 12px;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${(props) => props.theme.colors.textSecondary};
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
  background: ${(props) => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: ${(props) => props.theme.colors.shadow};
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
  color: ${(props) => props.theme.colors.text};
  margin: 0;
  font-size: 1.2rem;
`;

const ActionDescription = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
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
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard' | 'fumigaciones' | 'lotes' | 'profile' | 'reportes' | 'mapas'

  const { theme } = useTheme();

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);

    // Actualizar también en localStorage/sessionStorage
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    if (view === "profile") {
      setShowUserProfile(true);
    } else {
      setShowUserProfile(false);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setShowUserProfile(false);
  };

  const getBreadcrumbs = () => {
    switch (currentView) {
      case "fumigaciones":
        return ["Dashboard", "Gestión de Fumigaciones"];
      case "lotes":
        return ["Dashboard", "Gestión de Lotes"];
      case "reportes":
        return ["Dashboard", "Reportes y Análisis"];
      case "mapas":
        return ["Dashboard", "Mapa de Campos"];
      case "profile":
        return ["Dashboard", "Mi Perfil"];
      default:
        return ["Dashboard"];
    }
  };

  const handleFeatureClick = (featureName) => {
    if (featureName === "Gestión de Fumigaciones") {
      handleNavigation("fumigaciones");
    } else if (featureName === "Gestión de Lotes") {
      handleNavigation("lotes");
    } else if (featureName === "Reportes y Análisis") {
      handleNavigation("reportes");
    } else if (featureName === "Ver Mapa de Campos") {
      handleNavigation("mapas");
    } else {
      // En una aplicación real, aquí navegaríamos a la página correspondiente
      // eslint-disable-next-line no-alert
      alert(`Función en desarrollo: ${featureName}`);
    }
  };

  const stats = [
    {
      icon: GiSpray,
      value: "24",
      label: "Fumigaciones Programadas",
      color: "#4a7c59",
      bgColor: "rgba(74, 124, 89, 0.1)",
    },
    {
      icon: GiPlantSeed,
      value: "156",
      label: "Hectáreas Tratadas",
      color: "#6b8e23",
      bgColor: "rgba(107, 142, 35, 0.1)",
    },
    {
      icon: FaChartBar,
      value: "89%",
      label: "Efectividad Promedio",
      color: "#2e7d32",
      bgColor: "rgba(46, 125, 50, 0.1)",
    },
    {
      icon: FaCalendarAlt,
      value: "12",
      label: "Tareas Pendientes",
      color: "#f57c00",
      bgColor: "rgba(245, 124, 0, 0.1)",
    },
  ];

  const actions = [
    {
      icon: GiSpray,
      title: "Gestión de Fumigaciones",
      description:
        "Crea, edita y gestiona todas tus fumigaciones. Controla el estado y progreso de cada tratamiento.",
      action: () => handleFeatureClick("Gestión de Fumigaciones"),
    },
    {
      icon: GiWheat,
      title: "Gestión de Lotes",
      description:
        "Administra tus lotes de cultivo, dibuja polígonos y gestiona información geoespacial de tus campos.",
      action: () => handleFeatureClick("Gestión de Lotes"),
    },
    {
      icon: FaCalendarAlt,
      title: "Programar Fumigación",
      description:
        "Planifica nuevas tareas de fumigación para tus cultivos y establece fechas de aplicación.",
      action: () => handleFeatureClick("Programar Fumigación"),
    },
    {
      icon: FaMapMarkerAlt,
      title: "Ver Mapa de Campos",
      description:
        "Visualiza todos tus campos y el estado actual de las fumigaciones en curso.",
      action: () => handleFeatureClick("Ver Mapa de Campos"),
    },
    {
      icon: FaChartBar,
      title: "Reportes y Análisis",
      description:
        "Genera reportes detallados sobre la efectividad y costos de tus fumigaciones.",
      action: () => handleFeatureClick("Reportes y Análisis"),
    },
  ];

  return (
    <DashboardContainer theme={theme}>
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigation}
        onLogout={onLogout}
        showBack={currentView !== "dashboard"}
        onBack={handleBackToDashboard}
        breadcrumbs={getBreadcrumbs()}
        user={currentUser}
      />

      {currentView === "fumigaciones" ? (
        <FumigacionManager
          onBack={handleBackToDashboard}
          onLogout={onLogout}
          user={currentUser}
        />
      ) : currentView === "lotes" ? (
        <LoteManager onBack={handleBackToDashboard} />
      ) : currentView === "reportes" ? (
        <ReportesAnalytics onBack={handleBackToDashboard} />
      ) : currentView === "mapas" ? (
        <MapaFumigacionesGeoespacial onBack={handleBackToDashboard} />
      ) : (
        <Main>
          <WelcomeSection theme={theme}>
            <WelcomeTitle theme={theme}>¡Bienvenido de vuelta!</WelcomeTitle>
            <WelcomeSubtitle theme={theme}>
              Aquí tienes un resumen de tu sistema de gestión de fumigación.
            </WelcomeSubtitle>
          </WelcomeSection>

          {(showUserProfile || currentView === "profile") && (
            <UserProfile user={currentUser} onUserUpdate={handleUserUpdate} />
          )}

          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard key={index} theme={theme}>
                <StatIcon color={stat.color} bgColor={stat.bgColor}>
                  <stat.icon />
                </StatIcon>
                <StatInfo>
                  <StatValue theme={theme}>{stat.value}</StatValue>
                  <StatLabel theme={theme}>{stat.label}</StatLabel>
                </StatInfo>
              </StatCard>
            ))}
          </StatsGrid>

          <ActionsGrid>
            {actions.map((action, index) => (
              <ActionCard key={index} theme={theme}>
                <ActionHeader>
                  <ActionIcon>
                    <action.icon />
                  </ActionIcon>
                  <ActionTitle theme={theme}>{action.title}</ActionTitle>
                </ActionHeader>
                <ActionDescription theme={theme}>
                  {action.description}
                </ActionDescription>
                <ActionButton onClick={action.action}>Acceder</ActionButton>
              </ActionCard>
            ))}
          </ActionsGrid>
        </Main>
      )}
    </DashboardContainer>
  );
};

Dashboard.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
};

export default Dashboard;
