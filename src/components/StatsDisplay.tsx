import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

// ==================== INTERFACES & TYPES ====================

/** Tendencia de una estadística */
type TrendDirection = 'up' | 'down' | 'neutral';

/** Configuración de una estadística individual */
interface StatConfig {
  /** Identificador único de la estadística */
  id: string;
  /** Icono como emoji */
  icon: string;
  /** Título descriptivo */
  title: string;
  /** Valor principal a mostrar */
  value: string | number;
  /** Etiqueta/unidad del valor */
  label: string;
  /** Color primario de la tarjeta */
  color?: string;
  /** Color de fondo */
  bgColor?: string;
  /** Descripción adicional */
  description?: string;
  /** Valor de comparación (para mostrar cambio) */
  previousValue?: string | number;
  /** Dirección de tendencia */
  trend?: TrendDirection;
  /** Porcentaje de cambio */
  changePercent?: number;
  /** Si es un valor crítico (alerta) */
  isAlert?: boolean;
  /** Callback al hacer click */
  onClick?: () => void;
}

/** Configuración del tema */
interface ThemeColors {
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  primary: string;
  success: string;
  warning: string;
  error: string;
  shadow: string;
}

interface Theme {
  colors: ThemeColors;
}

/** Props del StatsDisplay */
interface StatsDisplayProps {
  /** Array de estadísticas a mostrar */
  stats: StatConfig[];
  /** Mostrar en modo compacto */
  compact?: boolean;
  /** Ancho mínimo de cada tarjeta */
  minCardWidth?: string;
  /** Título de la sección de estadísticas */
  title?: string;
  /** Mostrar tendencias */
  showTrends?: boolean;
  /** Mostrar descripciones */
  showDescriptions?: boolean;
  /** Callback cuando se hace click en una stat */
  onStatClick?: (stat: StatConfig) => void;
  /** Configuración del tema */
  theme?: Theme;
}

// ==================== STYLED COMPONENTS ====================

const Container = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h3<{ theme: Theme }>`
  color: ${props => props.theme.colors.text};
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatsContainer = styled.div<{
  compact?: boolean;
  minCardWidth?: string;
}>`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(${props => props.minCardWidth || '200px'}, 1fr)
  );
  gap: ${props => (props.compact ? '1rem' : '1.5rem')};
  padding: ${props => (props.compact ? '1rem' : '0')};
`;

const StatCard = styled.div<{
  compact?: boolean;
  color?: string;
  theme: Theme;
  clickable?: boolean;
  isAlert?: boolean;
}>`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: ${props => (props.compact ? '1rem' : '1.5rem')};
  box-shadow: ${props => props.theme.colors.shadow};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: ${props => (props.clickable ? 'pointer' : 'default')};

  &:hover {
    transform: ${props => (props.clickable ? 'translateY(-2px)' : 'none')};
    box-shadow: ${props =>
      props.clickable
        ? '0 8px 25px rgba(0, 0, 0, 0.15)'
        : props.theme.colors.shadow};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      if (props.isAlert) return props.theme.colors.error;
      return props.color || props.theme.colors.primary;
    }};
    border-radius: 4px 4px 0 0;
  }

  ${props =>
    props.isAlert &&
    `
    border-color: ${props.theme.colors.error};
    background: rgba(220, 53, 69, 0.05);
  `}
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const StatIconTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatIcon = styled.div<{ color?: string; theme: Theme }>`
  font-size: 1.5rem;
  color: ${props => props.color || props.theme.colors.primary};
`;

const StatTitle = styled.h4<{ theme: Theme }>`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const TrendIndicator = styled.div<{
  trend?: TrendDirection;
  theme: Theme;
}>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${props => {
    switch (props.trend) {
      case 'up':
        return props.theme.colors.success;
      case 'down':
        return props.theme.colors.error;
      default:
        return props.theme.colors.textSecondary;
    }
  }};
`;

const StatContent = styled.div`
  text-align: center;
`;

const StatValue = styled.div<{ theme: Theme; isAlert?: boolean }>`
  font-size: 2rem;
  font-weight: bold;
  color: ${props =>
    props.isAlert ? props.theme.colors.error : props.theme.colors.text};
  line-height: 1.1;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div<{ theme: Theme }>`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const StatDescription = styled.div<{ theme: Theme }>`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: left;
`;

const EmptyState = styled.div<{ theme: Theme }>`
  text-align: center;
  padding: 3rem 1rem;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.surface};
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 12px;

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

// ==================== UTILITY FUNCTIONS ====================

/**
 * Formatea un valor para mostrar
 */
const formatStatValue = (value: string | number): string => {
  if (typeof value === 'number') {
    // Formatear números grandes con separadores
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  }
  return String(value);
};

/**
 * Calcula el porcentaje de cambio entre dos valores
 */
const calculateChangePercent = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * Determina la tendencia basada en el cambio
 */
const determineTrend = (changePercent: number): TrendDirection => {
  if (changePercent > 0) return 'up';
  if (changePercent < 0) return 'down';
  return 'neutral';
};

/**
 * Obtiene el emoji de tendencia
 */
const getTrendIcon = (trend: TrendDirection): string => {
  switch (trend) {
    case 'up':
      return '📈';
    case 'down':
      return '📉';
    default:
      return '➖';
  }
};

// ==================== COMPONENTE PRINCIPAL ====================

/**
 * StatsDisplay - Componente genérico para mostrar estadísticas
 *
 * Características:
 * - Grid responsive de tarjetas de estadísticas
 * - Soporte para tendencias y comparaciones
 * - Indicadores visuales de alerta
 * - Formato automático de valores
 * - Totalmente tipado con TypeScript
 */
const StatsDisplay: React.FC<StatsDisplayProps> = ({
  stats,
  compact = false,
  minCardWidth = '200px',
  title,
  showTrends = true,
  showDescriptions = true,
  onStatClick,
  theme: customTheme,
}) => {
  const contextTheme = useTheme();
  const theme = customTheme ||
    contextTheme?.theme || {
      colors: {
        surface: '#ffffff',
        border: '#e0e0e0',
        text: '#333333',
        textSecondary: '#666666',
        primary: '#4a7c59',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    };

  // Procesar estadísticas con cálculos automáticos
  const processedStats = React.useMemo(() => {
    return stats.map(stat => {
      let processedStat = { ...stat };

      // Calcular cambio porcentual si hay valor anterior
      if (
        stat.previousValue &&
        typeof stat.value === 'number' &&
        typeof stat.previousValue === 'number'
      ) {
        if (!stat.changePercent) {
          processedStat.changePercent = calculateChangePercent(
            stat.value,
            stat.previousValue
          );
        }

        // Determinar tendencia automáticamente
        if (!stat.trend && processedStat.changePercent !== undefined) {
          processedStat.trend = determineTrend(processedStat.changePercent);
        }
      }

      return processedStat;
    });
  }, [stats]);

  const handleStatClick = (stat: StatConfig) => {
    if (stat.onClick) {
      stat.onClick();
    } else if (onStatClick) {
      onStatClick(stat);
    }
  };

  if (!processedStats || processedStats.length === 0) {
    return (
      <Container>
        {title && <SectionTitle theme={theme}>📊 {title}</SectionTitle>}
        <EmptyState theme={theme}>
          <div className="icon">📊</div>
          <div>No hay estadísticas disponibles</div>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      {title && <SectionTitle theme={theme}>📊 {title}</SectionTitle>}

      <StatsContainer compact={compact} minCardWidth={minCardWidth}>
        {processedStats.map(stat => (
          <StatCard
            key={stat.id}
            compact={compact}
            color={stat.color}
            theme={theme}
            clickable={!!(stat.onClick || onStatClick)}
            isAlert={stat.isAlert}
            onClick={() => handleStatClick(stat)}
          >
            <StatHeader>
              <StatIconTitle>
                <StatIcon color={stat.color} theme={theme}>
                  {stat.icon}
                </StatIcon>
                <StatTitle theme={theme}>{stat.title}</StatTitle>
              </StatIconTitle>

              {showTrends && stat.trend && stat.changePercent !== undefined && (
                <TrendIndicator trend={stat.trend} theme={theme}>
                  {getTrendIcon(stat.trend)}
                  {Math.abs(stat.changePercent)}%
                </TrendIndicator>
              )}
            </StatHeader>

            <StatContent>
              <StatValue theme={theme} isAlert={stat.isAlert}>
                {formatStatValue(stat.value)}
              </StatValue>
              <StatLabel theme={theme}>{stat.label}</StatLabel>
            </StatContent>

            {showDescriptions && stat.description && (
              <StatDescription theme={theme}>
                {stat.description}
              </StatDescription>
            )}
          </StatCard>
        ))}
      </StatsContainer>
    </Container>
  );
};

// ==================== EXPORTS ====================

export default StatsDisplay;
export type {
  StatsDisplayProps,
  StatConfig,
  TrendDirection,
  Theme,
  ThemeColors,
};
