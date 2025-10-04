import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useFumigaciones } from '../hooks/useApi';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaDownload,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import { GiSpray, GiPlantSeed } from 'react-icons/gi';

// Styled Components
const ReportesContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 100%);
  padding: 2rem;
`;

const ReportesHeader = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const HeaderTitle = styled.h1`
  color: #2d5016;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2rem;
`;

const HeaderSubtitle = styled.p`
  color: #666;
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterSelect = styled.select`
  padding: 0.6rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  min-width: 150px;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a7c59;
  }
`;

const FilterInput = styled.input`
  padding: 0.6rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a7c59;
  }
`;

const ExportButton = styled.button`
  background: linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-left: auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(74, 124, 89, 0.3);
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border-left: 5px solid ${props => props.color || '#4a7c59'};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const MetricIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.color || '#4a7c59'};
  background: ${props => props.bgColor || 'rgba(74, 124, 89, 0.1)'};
  padding: 1rem;
  border-radius: 12px;
`;

const MetricTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => (props.positive ? '#4caf50' : '#f44336')};
  font-size: 0.9rem;
  font-weight: 600;
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d5016;
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ChartsGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  min-height: 400px;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
`;

const ChartTitle = styled.h3`
  color: #2d5016;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.3rem;
  flex: 1;
`;

// Colores para gráficos
const COLORS = {
  primary: '#4a7c59',
  secondary: '#6b8e23',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  purple: '#9c27b0',
  teal: '#009688',
};

const PIE_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.warning,
  COLORS.info,
  COLORS.purple,
  COLORS.teal,
];

const ReportesAnalytics = ({ onBack }) => {
  // Usar el hook moderno en lugar de localStorage
  const { fumigaciones } = useFumigaciones();
  const [filtros, setFiltros] = useState(() => {
    // Configurar fechas por defecto (último año)
    const today = new Date();
    const lastYear = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate()
    );

    return {
      fechaInicio: lastYear.toISOString().split('T')[0],
      fechaFin: today.toISOString().split('T')[0],
      estado: 'TODOS',
      tipoTratamiento: 'TODOS',
    };
  });

  // Filtrar fumigaciones según los filtros aplicados
  const fumigacionesFiltradas = useMemo(() => {
    return fumigaciones.filter(fumigacion => {
      // Filtro por fecha
      if (filtros.fechaInicio && fumigacion.fechaPlanificada) {
        const fechaFumigacion = new Date(fumigacion.fechaPlanificada);
        const fechaInicio = new Date(filtros.fechaInicio);
        if (fechaFumigacion < fechaInicio) {
          return false;
        }
      }

      if (filtros.fechaFin && fumigacion.fechaPlanificada) {
        const fechaFumigacion = new Date(fumigacion.fechaPlanificada);
        const fechaFin = new Date(filtros.fechaFin);
        if (fechaFumigacion > fechaFin) {
          return false;
        }
      }

      // Filtro por estado
      if (filtros.estado !== 'TODOS' && fumigacion.estado !== filtros.estado) {
        return false;
      }

      // Filtro por tipo de tratamiento
      if (
        filtros.tipoTratamiento !== 'TODOS' &&
        fumigacion.tipoTratamiento !== filtros.tipoTratamiento
      ) {
        return false;
      }

      return true;
    });
  }, [fumigaciones, filtros]);

  // Calcular métricas
  const metricas = useMemo(() => {
    const total = fumigacionesFiltradas.length;
    const completadas = fumigacionesFiltradas.filter(
      f => f.estado === 'COMPLETADA'
    ).length;
    const hectareasTotales = fumigacionesFiltradas.reduce(
      (acc, f) => acc + (f.hectareas || 0),
      0
    );
    const costoTotal = fumigacionesFiltradas.reduce(
      (acc, f) => acc + (f.costo || 0),
      0
    );
    const tasaExito = total > 0 ? Math.round((completadas / total) * 100) : 0;

    return {
      totalFumigaciones: total,
      fumigacionesCompletadas: completadas,
      hectareasTratadas: Math.round(hectareasTotales * 10) / 10,
      costoTotal: Math.round(costoTotal),
      tasaExito,
      costoPromedioPorHectarea:
        hectareasTotales > 0
          ? Math.round((costoTotal / hectareasTotales) * 100) / 100
          : 0,
    };
  }, [fumigacionesFiltradas]);

  // Datos para gráfico de fumigaciones por mes
  const datosPorMes = useMemo(() => {
    const meses = {};

    fumigacionesFiltradas.forEach(fumigacion => {
      const fecha = new Date(fumigacion.fechaPlanificada);
      const mesKey = `${fecha.getFullYear()}-${String(
        fecha.getMonth() + 1
      ).padStart(2, '0')}`;
      const mesLabel = fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
      });

      if (!meses[mesKey]) {
        meses[mesKey] = {
          mes: mesLabel,
          fumigaciones: 0,
          hectareas: 0,
          costo: 0,
        };
      }

      meses[mesKey].fumigaciones += 1;
      meses[mesKey].hectareas += fumigacion.hectareas || 0;
      meses[mesKey].costo += fumigacion.costo || 0;
    });

    return Object.values(meses).sort((a, b) => a.mes.localeCompare(b.mes));
  }, [fumigacionesFiltradas]);

  // Datos para gráfico de estados
  const datosEstados = useMemo(() => {
    const estados = {
      PLANIFICADA: { name: 'Planificadas', value: 0, color: COLORS.info },
      EN_PROCESO: { name: 'En Proceso', value: 0, color: COLORS.warning },
      COMPLETADA: { name: 'Completadas', value: 0, color: COLORS.success },
      CANCELADA: { name: 'Canceladas', value: 0, color: COLORS.error },
    };

    fumigacionesFiltradas.forEach(fumigacion => {
      if (estados[fumigacion.estado]) {
        estados[fumigacion.estado].value += 1;
      }
    });

    return Object.values(estados).filter(estado => estado.value > 0);
  }, [fumigacionesFiltradas]);

  // Datos para gráfico de tipos de tratamiento
  const datosTipos = useMemo(() => {
    const tipos = {};

    fumigacionesFiltradas.forEach(fumigacion => {
      const tipo = fumigacion.tipoTratamiento || 'Sin especificar';
      tipos[tipo] = (tipos[tipo] || 0) + 1;
    });

    return Object.entries(tipos).map(([tipo, cantidad]) => ({
      name: tipo,
      value: cantidad,
    }));
  }, [fumigacionesFiltradas]);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleExport = () => {
    const csvContent = [
      // Headers
      [
        'Fecha',
        'Nombre',
        'Campo',
        'Tipo',
        'Estado',
        'Hectáreas',
        'Costo',
        'Responsable',
      ].join(','),
      // Data
      ...fumigacionesFiltradas.map(f =>
        [
          f.fechaPlanificada,
          f.nombre,
          f.campo,
          f.tipoTratamiento,
          f.estado,
          f.hectareas,
          f.costo,
          f.responsable,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-fumigaciones-${
      new Date().toISOString().split('T')[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = amount => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <ReportesContainer>
      <ReportesHeader>
        <HeaderTitle>
          <FaChartBar />
          Reportes y Análisis
        </HeaderTitle>
        <HeaderSubtitle>
          Análisis detallado de fumigaciones, costos y tendencias
        </HeaderSubtitle>

        <FilterSection>
          <FilterGroup>
            <FilterLabel>Fecha Inicio</FilterLabel>
            <FilterInput
              type="date"
              value={filtros.fechaInicio}
              onChange={e => handleFiltroChange('fechaInicio', e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Fecha Fin</FilterLabel>
            <FilterInput
              type="date"
              value={filtros.fechaFin}
              onChange={e => handleFiltroChange('fechaFin', e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Estado</FilterLabel>
            <FilterSelect
              value={filtros.estado}
              onChange={e => handleFiltroChange('estado', e.target.value)}
            >
              <option value="TODOS">Todos los estados</option>
              <option value="PLANIFICADA">Planificadas</option>
              <option value="EN_PROCESO">En Proceso</option>
              <option value="COMPLETADA">Completadas</option>
              <option value="CANCELADA">Canceladas</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Tipo</FilterLabel>
            <FilterSelect
              value={filtros.tipoTratamiento}
              onChange={e =>
                handleFiltroChange('tipoTratamiento', e.target.value)
              }
            >
              <option value="TODOS">Todos los tipos</option>
              <option value="Preventivo">Preventivo</option>
              <option value="Correctivo">Correctivo</option>
              <option value="Masivo">Masivo</option>
              <option value="Selectivo">Selectivo</option>
            </FilterSelect>
          </FilterGroup>

          <ExportButton onClick={handleExport}>
            <FaDownload />
            Exportar CSV
          </ExportButton>
        </FilterSection>
      </ReportesHeader>

      {/* Métricas Principales */}
      <MetricsGrid>
        <MetricCard color={COLORS.primary}>
          <MetricHeader>
            <MetricIcon color={COLORS.primary} bgColor="rgba(74, 124, 89, 0.1)">
              <GiSpray />
            </MetricIcon>
            <MetricTrend positive={metricas.totalFumigaciones > 0}>
              <FaArrowUp />+{metricas.totalFumigaciones}
            </MetricTrend>
          </MetricHeader>
          <MetricValue>{metricas.totalFumigaciones}</MetricValue>
          <MetricLabel>Total Fumigaciones</MetricLabel>
        </MetricCard>

        <MetricCard color={COLORS.success}>
          <MetricHeader>
            <MetricIcon color={COLORS.success} bgColor="rgba(76, 175, 80, 0.1)">
              <GiPlantSeed />
            </MetricIcon>
            <MetricTrend positive={metricas.hectareasTratadas > 0}>
              <FaArrowUp />
              {metricas.hectareasTratadas} ha
            </MetricTrend>
          </MetricHeader>
          <MetricValue>{metricas.hectareasTratadas}</MetricValue>
          <MetricLabel>Hectáreas Tratadas</MetricLabel>
        </MetricCard>

        <MetricCard color={COLORS.warning}>
          <MetricHeader>
            <MetricIcon color={COLORS.warning} bgColor="rgba(255, 152, 0, 0.1)">
              💰
            </MetricIcon>
            <MetricTrend positive={metricas.costoPromedioPorHectarea > 0}>
              <FaArrowUp />
              {formatCurrency(metricas.costoPromedioPorHectarea)}/ha
            </MetricTrend>
          </MetricHeader>
          <MetricValue>{formatCurrency(metricas.costoTotal)}</MetricValue>
          <MetricLabel>Costo Total</MetricLabel>
        </MetricCard>

        <MetricCard color={COLORS.info}>
          <MetricHeader>
            <MetricIcon color={COLORS.info} bgColor="rgba(33, 150, 243, 0.1)">
              ✅
            </MetricIcon>
            <MetricTrend positive={metricas.tasaExito >= 75}>
              {metricas.tasaExito >= 75 ? <FaArrowUp /> : <FaArrowDown />}
              {metricas.tasaExito}%
            </MetricTrend>
          </MetricHeader>
          <MetricValue>{metricas.fumigacionesCompletadas}</MetricValue>
          <MetricLabel>Fumigaciones Completadas</MetricLabel>
        </MetricCard>
      </MetricsGrid>

      {/* Gráficos */}
      <ChartsGrid>
        {/* Gráfico de Fumigaciones por Mes */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <FaChartLine />
              Fumigaciones por Mes
            </ChartTitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={datosPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === 'fumigaciones'
                    ? `${value} fumigaciones`
                    : name === 'hectareas'
                      ? `${value} ha`
                      : formatCurrency(value),
                  name === 'fumigaciones'
                    ? 'Fumigaciones'
                    : name === 'hectareas'
                      ? 'Hectáreas'
                      : 'Costo',
                ]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="fumigaciones"
                stackId="1"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gráfico de Estados */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <FaChartPie />
              Distribución por Estados
            </ChartTitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosEstados}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {datosEstados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gráfico de Costos por Mes */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <FaChartBar />
              Costos por Mes
            </ChartTitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={value => [formatCurrency(value), 'Costo']} />
              <Legend />
              <Bar dataKey="costo" fill={COLORS.secondary} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gráfico de Tipos de Tratamiento */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <FaChartPie />
              Tipos de Tratamiento
            </ChartTitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosTipos}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {datosTipos.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>
    </ReportesContainer>
  );
};

ReportesAnalytics.propTypes = {
  onBack: PropTypes.func,
};

export default ReportesAnalytics;
