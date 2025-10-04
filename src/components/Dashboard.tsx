import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useFumigaciones, useLotes } from '../hooks/useApi';
import { User, Fumigacion, Theme } from '../types/index';
import UserProfile from './UserProfile';
import FumigacionManager from './FumigacionManager';
import LoteManager from './LoteManager';
import Navbar from './Navbar';
import ReportesAnalytics from './ReportesAnalytics';
import MapaFumigacionesGeoespacial from './MapaFumigacionesGeoespacial';

// ==================== INTERFACES ====================

/** Estadística del dashboard */
interface DashboardStat {
  icon: any;
  value: string;
  label: string;
  color: string;
  bgColor: string;
}

/** Acción disponible en el dashboard */
interface DashboardAction {
  icon: string;
  title: string;
  description: string;
  action: () => void;
}

/** Vistas disponibles en el dashboard */
type DashboardView =
  | 'dashboard'
  | 'fumigaciones'
  | 'lotes'
  | 'profile'
  | 'reportes'
  | 'mapas';

/** Props del componente Dashboard */
interface DashboardProps {
  /** Usuario actual del sistema */
  user?: User;
  /** Función callback para cerrar sesión */
  onLogout?: () => void;
}

// ==================== STYLED COMPONENTS ====================

const DashboardContainer = styled.div<{ theme: any }>`
  min-height: 100vh;
  background: ${props => props.theme.colors.backgroundGradient};
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const WelcomeSection = styled.section<{ theme: any }>`
  background: ${props => props.theme.colors.surface};
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px ${props => props.theme.colors.shadow};
`;

const WelcomeTitle = styled.h1<{ theme: any }>`
  color: ${props => props.theme.colors.primary};
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
`;

const WelcomeSubtitle = styled.p<{ theme: any }>`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ theme: any }>`
  background: ${props => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px ${props => props.theme.colors.shadow};
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px ${props => props.theme.colors.shadow};
  }
`;

const StatIcon = styled.div<{ color: string; bgColor: string }>`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${props => props.bgColor};
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div<{ theme: any }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div<{ theme: any }>`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ActionCard = styled.div<{ theme: any }>`
  background: ${props => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px ${props => props.theme.colors.shadow};
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px ${props => props.theme.colors.shadow};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ActionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ActionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, #4a7c59, #6b8e23);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const ActionTitle = styled.h3<{ theme: any }>`
  color: ${props => props.theme.colors.text};
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ActionDescription = styled.p<{ theme: any }>`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 1.5rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #4a7c59, #6b8e23);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(74, 124, 89, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// ==================== MAIN COMPONENT ====================

/**
 * Componente principal del dashboard con gestión de vistas y estadísticas
 *
 * @description
 * Dashboard principal que muestra:
 * - Estadísticas en tiempo real de fumigaciones y lotes
 * - Navegación entre diferentes secciones del sistema
 * - Gestión del perfil de usuario
 * - Acciones rápidas para las funciones principales
 *
 * @example
 * ```tsx
 * <Dashboard
 *   user={currentUser}
 *   onLogout={() => authService.logout()}
 * />
 * ```
 */
const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  // ==================== STATE ====================

  const [showUserProfile, setShowUserProfile] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(user);
  const [currentView, setCurrentView] = useState<DashboardView>('dashboard');

  const { theme } = useTheme();

  // Obtener datos reales del API
  const { fumigaciones, isLoading: fumigacionesLoading } = useFumigaciones();
  const { isLoading: lotesLoading } = useLotes();

  // ==================== COMPUTED VALUES ====================

  /**
   * Calcula las estadísticas del dashboard basadas en los datos actuales
   */
  const stats = useMemo((): DashboardStat[] => {
    if (fumigacionesLoading || lotesLoading) {
      return [
        {
          icon: '🚿',
          value: '...',
          label: 'Fumigaciones Programadas',
          color: '#4a7c59',
          bgColor: 'rgba(74, 124, 89, 0.1)',
        },
        {
          icon: '🌱',
          value: '...',
          label: 'Hectáreas Tratadas',
          color: '#6b8e23',
          bgColor: 'rgba(107, 142, 35, 0.1)',
        },
        {
          icon: '📊',
          value: '...',
          label: 'Efectividad Promedio',
          color: '#2e7d32',
          bgColor: 'rgba(46, 125, 50, 0.1)',
        },
        {
          icon: '📅',
          value: '...',
          label: 'Tareas Pendientes',
          color: '#f57c00',
          bgColor: 'rgba(245, 124, 0, 0.1)',
        },
      ];
    }

    const fumigacionesProgramadas = fumigaciones.filter(
      f => f.estado === 'PLANIFICADA' || f.estado === 'EN_PROCESO'
    ).length;

    const hectareasTratadas = fumigaciones
      .filter(f => f.estado === 'COMPLETADA')
      .reduce((total, f) => total + (f.hectareas || 0), 0);

    const fumigacionesCompletadas = fumigaciones.filter(
      f => f.estado === 'COMPLETADA'
    );
    const efectividadPromedio =
      fumigacionesCompletadas.length > 0
        ? Math.round(
            fumigacionesCompletadas.reduce(
              (sum, f) => sum + (f.resultados?.efectividad || 85),
              0
            ) / fumigacionesCompletadas.length
          )
        : 0;

    const tareasPendientes = fumigaciones.filter(
      f => f.estado === 'PLANIFICADA'
    ).length;

    return [
      {
        icon: '🚿',
        value: fumigacionesProgramadas.toString(),
        label: 'Fumigaciones Programadas',
        color: '#4a7c59',
        bgColor: 'rgba(74, 124, 89, 0.1)',
      },
      {
        icon: '🌱',
        value: Math.round(hectareasTratadas).toString(),
        label: 'Hectáreas Tratadas',
        color: '#6b8e23',
        bgColor: 'rgba(107, 142, 35, 0.1)',
      },
      {
        icon: '📊',
        value: efectividadPromedio > 0 ? `${efectividadPromedio}%` : 'N/A',
        label: 'Efectividad Promedio',
        color: '#2e7d32',
        bgColor: 'rgba(46, 125, 50, 0.1)',
      },
      {
        icon: '📅',
        value: tareasPendientes.toString(),
        label: 'Tareas Pendientes',
        color: '#f57c00',
        bgColor: 'rgba(245, 124, 0, 0.1)',
      },
    ];
  }, [fumigaciones, fumigacionesLoading, lotesLoading]);

  /**
   * Acciones disponibles en el dashboard principal
   */
  const actions = useMemo(
    (): DashboardAction[] => [
      {
        icon: '🚿',
        title: 'Gestión de Fumigaciones',
        description:
          'Crea, edita y gestiona todas tus fumigaciones. Controla el estado y progreso de cada tratamiento.',
        action: () => handleFeatureClick('Gestión de Fumigaciones'),
      },
      {
        icon: '🌾',
        title: 'Gestión de Lotes',
        description:
          'Administra tus lotes de cultivo, dibuja polígonos y gestiona información geoespacial de tus campos.',
        action: () => handleFeatureClick('Gestión de Lotes'),
      },
      {
        icon: '📅',
        title: 'Programar Fumigación',
        description:
          'Planifica nuevas tareas de fumigación para tus cultivos y establece fechas de aplicación.',
        action: () => handleFeatureClick('Programar Fumigación'),
      },
      {
        icon: '🗺️',
        title: 'Ver Mapa de Campos',
        description:
          'Visualiza todos tus campos y el estado actual de las fumigaciones en curso.',
        action: () => handleFeatureClick('Ver Mapa de Campos'),
      },
      {
        icon: '📊',
        title: 'Reportes y Análisis',
        description:
          'Genera reportes detallados sobre la efectividad y costos de tus fumigaciones.',
        action: () => handleFeatureClick('Reportes y Análisis'),
      },
    ],
    []
  );

  // ==================== EVENT HANDLERS ====================

  /**
   * Actualiza la información del usuario actual
   */
  const handleUserUpdate = (updatedUser: User): void => {
    setCurrentUser(updatedUser);

    // Actualizar también en localStorage/sessionStorage
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  /**
   * Maneja la navegación entre diferentes vistas del dashboard
   */
  const handleNavigation = (view: DashboardView): void => {
    setCurrentView(view);
    if (view === 'profile') {
      setShowUserProfile(true);
    } else {
      setShowUserProfile(false);
    }
  };

  /**
   * Navega de vuelta al dashboard principal
   */
  const handleBackToDashboard = (): void => {
    setCurrentView('dashboard');
    setShowUserProfile(false);
  };

  /**
   * Genera las migas de pan basadas en la vista actual
   */
  const getBreadcrumbs = (): string[] => {
    switch (currentView) {
      case 'fumigaciones':
        return ['Dashboard', 'Gestión de Fumigaciones'];
      case 'lotes':
        return ['Dashboard', 'Gestión de Lotes'];
      case 'reportes':
        return ['Dashboard', 'Reportes y Análisis'];
      case 'mapas':
        return ['Dashboard', 'Mapa de Campos'];
      case 'profile':
        return ['Dashboard', 'Mi Perfil'];
      default:
        return ['Dashboard'];
    }
  };

  /**
   * Maneja los clics en las acciones del dashboard
   */
  const handleFeatureClick = (featureName: string): void => {
    switch (featureName) {
      case 'Gestión de Fumigaciones':
        handleNavigation('fumigaciones');
        break;
      case 'Gestión de Lotes':
        handleNavigation('lotes');
        break;
      case 'Reportes y Análisis':
        handleNavigation('reportes');
        break;
      case 'Ver Mapa de Campos':
        handleNavigation('mapas');
        break;
      default:
        // En una aplicación real, aquí navegaríamos a la página correspondiente
        alert(`Función en desarrollo: ${featureName}`);
    }
  };

  // ==================== RENDER ====================

  return (
    <DashboardContainer theme={theme}>
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigation}
        onLogout={onLogout}
        showBack={currentView !== 'dashboard'}
        onBack={handleBackToDashboard}
        breadcrumbs={getBreadcrumbs()}
        user={currentUser}
      />

      {currentView === 'fumigaciones' ? (
        <FumigacionManager
          onBack={handleBackToDashboard}
          onLogout={onLogout}
          user={currentUser}
        />
      ) : currentView === 'lotes' ? (
        <LoteManager onBack={handleBackToDashboard} />
      ) : currentView === 'reportes' ? (
        <ReportesAnalytics onBack={handleBackToDashboard} />
      ) : currentView === 'mapas' ? (
        <MapaFumigacionesGeoespacial onBack={handleBackToDashboard} />
      ) : (
        <Main>
          <WelcomeSection theme={theme}>
            <WelcomeTitle theme={theme}>¡Bienvenido de vuelta!</WelcomeTitle>
            <WelcomeSubtitle theme={theme}>
              Aquí tienes un resumen de tu sistema de gestión de fumigación.
            </WelcomeSubtitle>
          </WelcomeSection>

          {(showUserProfile || currentView === 'profile') && (
            <UserProfile user={currentUser} onUserUpdate={handleUserUpdate} />
          )}

          <StatsGrid>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <StatCard key={index} theme={theme}>
                  <StatIcon color={stat.color} bgColor={stat.bgColor}>
                    <IconComponent />
                  </StatIcon>
                  <StatInfo>
                    <StatValue theme={theme}>{stat.value}</StatValue>
                    <StatLabel theme={theme}>{stat.label}</StatLabel>
                  </StatInfo>
                </StatCard>
              );
            })}
          </StatsGrid>

          <ActionsGrid>
            {actions.map((action, index) => (
              <ActionCard key={index} theme={theme}>
                <ActionHeader>
                  <ActionIcon>{action.icon}</ActionIcon>
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

export default Dashboard;
export type {
  DashboardProps,
  User,
  DashboardStat,
  DashboardAction,
  DashboardView,
};
