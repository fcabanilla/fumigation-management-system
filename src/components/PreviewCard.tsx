import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { MapViewer } from './MapComponent';
import * as turf from '@turf/turf';

// ==================== INTERFACES & TYPES ====================

/** Entidad base para preview */
interface PreviewEntity {
  id: string | number;
  name?: string;
  nombre?: string;
  geometry?: any;
  geometria?: any;
  [key: string]: any;
}

/** Configuración de campo para mostrar */
interface PreviewField {
  key: string;
  label: string;
  icon: string;
  format?: (value: any) => string;
  condition?: (entity: PreviewEntity) => boolean;
}

/** Configuración del tema (compatible con ThemeContext) */
interface ThemeColors {
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  primary: string;
  textOnPrimary: string;
  shadow: string;
}

interface Theme {
  colors: ThemeColors;
}

/** Props del PreviewCard */
interface PreviewCardProps {
  /** Entidad a mostrar */
  entity: PreviewEntity;
  /** Tipo de entidad (para configuración específica) */
  entityType?: 'lote' | 'fumigacion' | 'generic';
  /** Mostrar en modo compacto */
  compact?: boolean;
  /** Mostrar mapa */
  showMap?: boolean;
  /** Altura del mapa */
  mapHeight?: string;
  /** Callback para expandir vista */
  onExpand?: (entity: PreviewEntity) => void;
  /** Mostrar botón de expandir */
  showExpandButton?: boolean;
  /** Campos personalizados a mostrar */
  customFields?: PreviewField[];
  /** Configuración del tema */
  theme?: Theme;
}

/** Estadísticas calculadas de geometría */
interface GeometryStats {
  area: number;
  perimeter: number;
  vertices: number;
}

// ==================== STYLED COMPONENTS ====================

const PreviewContainer = styled.div<{ compact?: boolean; theme: Theme }>`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: ${props => (props.compact ? '1rem' : '1.5rem')};
  margin: ${props => (props.compact ? '0.5rem 0' : '1rem 0')};
  box-shadow: ${props => props.theme.colors.shadow};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const PreviewHeader = styled.div<{ compact?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => (props.compact ? '0.75rem' : '1rem')};
`;

const EntityTitle = styled.h4<{ compact?: boolean; theme: Theme }>`
  color: ${props => props.theme.colors.text};
  margin: 0;
  font-size: ${props => (props.compact ? '1rem' : '1.2rem')};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EntityInfo = styled.div<{ theme: Theme }>`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const ContentGrid = styled.div<{ compact?: boolean; showMap?: boolean }>`
  display: grid;
  grid-template-columns: ${props =>
    props.compact ? '1fr' : props.showMap ? '1fr 1fr' : '1fr'};
  gap: 1rem;
  align-items: start;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const InfoIcon = styled.span<{ theme: Theme }>`
  color: ${props => props.theme.colors.primary};
  font-size: 1rem;
`;

const InfoText = styled.span<{ theme: Theme }>`
  color: ${props => props.theme.colors.text};
`;

const StatsGrid = styled.div<{ theme: Theme }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const StatValue = styled.div<{ compact?: boolean; theme: Theme }>`
  font-size: ${props => (props.compact ? '0.9rem' : '1rem')};
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const StatLabel = styled.div<{ theme: Theme }>`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
`;

const MapSection = styled.div<{ height?: string; theme: Theme }>`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
  height: ${props => props.height || '200px'};
`;

const ExpandButton = styled.button<{ theme: Theme }>`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textOnPrimary};
  border: none;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const EmptyState = styled.div<{ theme: Theme }>`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.surface};
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 8px;

  svg {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }
`;

const InfoLabel = styled.div<{ theme: Theme }>`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.25rem;
`;

// ==================== CONFIGURACIONES POR TIPO ====================

/** Configuraciones de campos por tipo de entidad */
const ENTITY_CONFIGURATIONS: Record<string, PreviewField[]> = {
  lote: [
    {
      key: 'hectareas',
      label: 'hectáreas declaradas',
      icon: '📐',
      format: value => `${value} ha`,
    },
    {
      key: 'propietario',
      label: 'propietario',
      icon: '👤',
    },
    {
      key: 'cultivo',
      label: 'cultivo',
      icon: '🌱',
    },
    {
      key: 'geometria',
      label: 'geometría',
      icon: '🗺️',
      format: value => (value ? '✅ Definida' : '❌ Sin definir'),
    },
  ],
  fumigacion: [
    {
      key: 'campo',
      label: 'campo',
      icon: '🌾',
    },
    {
      key: 'producto',
      label: 'producto',
      icon: '🧪',
    },
    {
      key: 'fechaPlanificada',
      label: 'fecha planificada',
      icon: '📅',
      format: value => new Date(value).toLocaleDateString(),
    },
    {
      key: 'estado',
      label: 'estado',
      icon: 'ℹ️',
    },
  ],
  generic: [
    {
      key: 'id',
      label: 'identificador',
      icon: '🔢',
    },
  ],
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Calcula estadísticas de geometría
 */
const calculateGeometryStats = (geometry: any): GeometryStats => {
  if (!geometry || !geometry.geometry) {
    return { area: 0, perimeter: 0, vertices: 0 };
  }

  try {
    const area = turf.area(geometry) / 10000; // Convertir a hectáreas
    const perimeter = turf.length(geometry, { units: 'kilometers' });
    const vertices = geometry.geometry.coordinates[0].length - 1;

    return {
      area: Math.round(area * 100) / 100,
      perimeter: Math.round(perimeter * 100) / 100,
      vertices,
    };
  } catch {
    return { area: 0, perimeter: 0, vertices: 0 };
  }
};

/**
 * Obtiene el nombre de la entidad
 */
const getEntityName = (entity: PreviewEntity): string => {
  return entity.name || entity.nombre || `Entidad ${entity.id}`;
};

/**
 * Obtiene la geometría de la entidad
 */
const getEntityGeometry = (entity: PreviewEntity): any => {
  return entity.geometry || entity.geometria;
};

// ==================== COMPONENTE PRINCIPAL ====================

/**
 * PreviewCard - Componente genérico para mostrar vista previa de entidades
 *
 * Características:
 * - Adaptable a diferentes tipos de entidad
 * - Modos compacto y expandido
 * - Integración con mapas
 * - Cálculo automático de estadísticas geoespaciales
 * - Configuración personalizable de campos
 */
const PreviewCard: React.FC<PreviewCardProps> = ({
  entity,
  entityType = 'generic',
  compact = false,
  showMap = true,
  mapHeight = '200px',
  onExpand,
  showExpandButton = false,
  customFields,
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
        textOnPrimary: '#ffffff',
        shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    };

  // Configuración de campos a mostrar
  const fieldsConfig =
    customFields ||
    ENTITY_CONFIGURATIONS[entityType] ||
    ENTITY_CONFIGURATIONS.generic;

  // Calcular estadísticas de geometría
  const geometry = getEntityGeometry(entity);
  const stats = React.useMemo(
    () => calculateGeometryStats(geometry),
    [geometry]
  );

  if (!entity) {
    return (
      <PreviewContainer theme={theme} compact={compact}>
        <EmptyState theme={theme}>
          ❌<div>Sin información de entidad</div>
        </EmptyState>
      </PreviewContainer>
    );
  }

  return (
    <PreviewContainer theme={theme} compact={compact}>
      <PreviewHeader compact={compact}>
        <div>
          <EntityTitle theme={theme} compact={compact}>
            {entityType === 'lote'
              ? '🌾'
              : entityType === 'fumigacion'
                ? '🚿'
                : '📄'}
            {getEntityName(entity)}
          </EntityTitle>
          <EntityInfo theme={theme}>
            {entity.cultivo &&
              entity.propietario &&
              `${entity.cultivo} • ${entity.propietario}`}
            {entity.campo &&
              entity.estado &&
              `${entity.campo} • ${entity.estado}`}
          </EntityInfo>
        </div>

        {showExpandButton && onExpand && (
          <ExpandButton theme={theme} onClick={() => onExpand(entity)}>
            🔍
            {!compact && 'Ver completo'}
          </ExpandButton>
        )}
      </PreviewHeader>

      <ContentGrid compact={compact} showMap={showMap && !compact}>
        <InfoSection>
          {/* Campos configurados */}
          {fieldsConfig.map(field => {
            const value = entity[field.key];
            if (field.condition && !field.condition(entity)) return null;
            if (value === undefined || value === null) return null;

            return (
              <InfoRow key={field.key}>
                <InfoIcon theme={theme}>{field.icon}</InfoIcon>
                <InfoText theme={theme}>
                  {field.format ? field.format(value) : String(value)}
                </InfoText>
              </InfoRow>
            );
          })}

          {/* Estadísticas de geometría */}
          {geometry && !compact && (
            <StatsGrid theme={theme}>
              <StatItem>
                <StatValue theme={theme} compact={compact}>
                  {stats.area}
                </StatValue>
                <StatLabel theme={theme}>ha calc.</StatLabel>
              </StatItem>

              <StatItem>
                <StatValue theme={theme} compact={compact}>
                  {stats.perimeter}
                </StatValue>
                <StatLabel theme={theme}>km per.</StatLabel>
              </StatItem>

              <StatItem>
                <StatValue theme={theme} compact={compact}>
                  {stats.vertices}
                </StatValue>
                <StatLabel theme={theme}>vértices</StatLabel>
              </StatItem>
            </StatsGrid>
          )}
        </InfoSection>

        {/* Mapa */}
        {showMap && !compact && geometry && (
          <MapSection theme={theme} height={mapHeight}>
            <MapViewer
              geometry={geometry}
              height={mapHeight}
              showControls={false}
            />
          </MapSection>
        )}
      </ContentGrid>

      {/* Estado vacío para mapa */}
      {showMap && !compact && !geometry && (
        <EmptyState theme={theme}>
          🗺️
          <div>Sin ubicación geográfica</div>
          <InfoLabel theme={theme}>
            Edita la entidad para agregar su geometría
          </InfoLabel>
        </EmptyState>
      )}
    </PreviewContainer>
  );
};

// ==================== EXPORTS ====================

export default PreviewCard;
export type { PreviewCardProps, PreviewEntity, PreviewField, GeometryStats };
