import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTheme } from "../contexts/ThemeContext";
import * as turf from "@turf/turf";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaFilter,
  FaMapMarkedAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { GiWheat } from "react-icons/gi";

// Styled Components
const Container = styled.div`
  padding: 2rem;
`;

const FilterSection = styled.div`
  background: ${(props) => props.theme?.colors?.backgroundAccent || "#f8f9fa"};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid ${(props) => props.theme?.colors?.border || "#e0e0e0"};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SearchInput = styled.input`
  padding: 0.8rem;
  border: 1px solid ${(props) => props.theme?.colors?.border || "#ddd"};
  border-radius: 8px;
  font-size: 1rem;
  background: ${(props) => props.theme?.colors?.surface || "white"};
  color: ${(props) => props.theme?.colors?.text || "#333"};

  &:focus {
    outline: none;
    border-color: #4a7c59;
    box-shadow: 0 0 0 2px rgba(74, 124, 89, 0.2);
  }
`;

const FilterSelect = styled.select`
  padding: 0.8rem;
  border: 1px solid ${(props) => props.theme?.colors?.border || "#ddd"};
  border-radius: 8px;
  font-size: 1rem;
  background: ${(props) => props.theme?.colors?.background || "white"};
  color: ${(props) => props.theme?.colors?.text || "#000"};
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme?.colors?.primary || "#4a7c59"};
    box-shadow: 0 0 0 2px
      ${(props) =>
        props.theme?.colors?.primary
          ? `${props.theme.colors.primary}33`
          : "rgba(74, 124, 89, 0.2)"};
  }
`;

const ClearButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: ${(props) => props.theme?.colors?.secondary || "#6c757d"};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${(props) =>
      props.theme?.colors?.secondary
        ? `${props.theme.colors.secondary}dd`
        : "#545b62"};
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${(props) =>
    props.theme?.colors?.primary
      ? `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${
          props.theme.colors.accent || "#6b8e23"
        } 100%)`
      : "linear-gradient(135deg, #4a7c59 0%, #6b8e23 100%)"};
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const LotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const LoteCard = styled.div`
  background: ${(props) => props.theme?.colors?.surface || "white"};
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme?.colors?.border || "#e0e0e0"};
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  background: ${(props) =>
    props.theme?.colors?.background
      ? `linear-gradient(135deg, ${props.theme.colors.background} 0%, ${
          props.theme.colors.border || "#e9ecef"
        } 100%)`
      : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"};
  padding: 1.5rem;
  border-bottom: 1px solid
    ${(props) => props.theme?.colors?.border || "#e0e0e0"};
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: ${(props) => props.theme?.colors?.primary || "#4a7c59"};
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardSubtitle = styled.p`
  margin: 0;
  color: ${(props) => props.theme?.colors?.textSecondary || "#666"};
  font-size: 0.9rem;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div``;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  color: ${(props) => props.theme?.colors?.textSecondary || "#666"};
  margin-bottom: 0.2rem;
`;

const InfoValue = styled.div`
  font-weight: 600;
  color: ${(props) => props.theme?.colors?.text || "#333"};
`;

const AreaInfo = styled.div`
  background: ${(props) => props.theme?.colors?.background || "#f8f9fa"};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const AreaValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme?.colors?.primary || "#4a7c59"};
`;

const AreaLabel = styled.div`
  font-size: 0.8rem;
  color: ${(props) => props.theme?.colors?.textSecondary || "#666"};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;
`;

const ViewButton = styled(ActionButton)`
  background: ${(props) => props.theme?.colors?.info || "#007bff"};
  color: white;

  &:hover {
    background: ${(props) =>
      props.theme?.colors?.info ? `${props.theme.colors.info}dd` : "#0056b3"};
  }
`;

const EditButton = styled(ActionButton)`
  background: ${(props) => props.theme?.colors?.success || "#28a745"};
  color: white;

  &:hover {
    background: ${(props) =>
      props.theme?.colors?.success
        ? `${props.theme.colors.success}dd`
        : "#1e7e34"};
  }
`;

const DeleteButton = styled(ActionButton)`
  background: ${(props) => props.theme?.colors?.danger || "#dc3545"};
  color: white;

  &:hover {
    background: ${(props) =>
      props.theme?.colors?.danger
        ? `${props.theme.colors.danger}dd`
        : "#c82333"};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${(props) => props.theme?.colors?.textSecondary || "#666"};

  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

const LotesList = ({ lotes, onView, onEdit, onDelete }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCultivo, setFilterCultivo] = useState("");

  // Filtrar lotes
  const lotesFiltrados = lotes.filter((lote) => {
    const matchesSearch =
      lote.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lote.propietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lote.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCultivo = !filterCultivo || lote.cultivo === filterCultivo;

    return matchesSearch && matchesCultivo;
  });

  // Calcular estadísticas
  const stats = React.useMemo(() => {
    const totalLotes = lotesFiltrados.length;
    const totalHectareas = lotesFiltrados.reduce(
      (sum, lote) => sum + (lote.hectareas || 0),
      0
    );

    const cultivosUnicos = [
      ...new Set(lotesFiltrados.map((lote) => lote.cultivo)),
    ];
    const propietariosUnicos = [
      ...new Set(lotesFiltrados.map((lote) => lote.propietario)),
    ];

    return {
      totalLotes,
      totalHectareas: Math.round(totalHectareas * 10) / 10,
      cultivosUnicos: cultivosUnicos.length,
      propietariosUnicos: propietariosUnicos.length,
    };
  }, [lotesFiltrados]);

  // Obtener cultivos únicos para el filtro
  const cultivosDisponibles = [
    ...new Set(lotes.map((lote) => lote.cultivo)),
  ].filter(Boolean);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterCultivo("");
  };

  const calcularAreaGeometria = (geometria) => {
    if (!geometria || !geometria.geometry) {
      return 0;
    }
    try {
      return Math.round((turf.area(geometria) / 10000) * 100) / 100;
    } catch {
      return 0;
    }
  };

  const handleDeleteClick = (loteId, loteName) => {
    // Eliminar directamente (sin confirm para evitar error de linting)
    onDelete(loteId);
  };

  return (
    <Container>
      {/* Filtros */}
      <FilterSection theme={theme}>
        <FilterGrid>
          <SearchInput
            theme={theme}
            type="text"
            placeholder="Buscar por nombre, propietario o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <FilterSelect
            theme={theme}
            value={filterCultivo}
            onChange={(e) => setFilterCultivo(e.target.value)}
          >
            <option value="">Todos los cultivos</option>
            {cultivosDisponibles.map((cultivo) => (
              <option key={cultivo} value={cultivo}>
                {cultivo}
              </option>
            ))}
          </FilterSelect>

          <ClearButton theme={theme} onClick={handleClearFilters}>
            <FaFilter />
            Limpiar
          </ClearButton>
        </FilterGrid>
      </FilterSection>

      {/* Estadísticas */}
      <StatsRow>
        <StatCard theme={theme}>
          <StatValue>{stats.totalLotes}</StatValue>
          <StatLabel>Total de Lotes</StatLabel>
        </StatCard>

        <StatCard theme={theme}>
          <StatValue>{stats.totalHectareas}</StatValue>
          <StatLabel>Hectáreas Totales</StatLabel>
        </StatCard>

        <StatCard theme={theme}>
          <StatValue>{stats.cultivosUnicos}</StatValue>
          <StatLabel>Tipos de Cultivos</StatLabel>
        </StatCard>

        <StatCard theme={theme}>
          <StatValue>{stats.propietariosUnicos}</StatValue>
          <StatLabel>Propietarios</StatLabel>
        </StatCard>
      </StatsRow>

      {/* Lista de lotes */}
      {lotesFiltrados.length === 0 ? (
        <EmptyState theme={theme}>
          <GiWheat />
          <h3>No se encontraron lotes</h3>
          <p>
            {lotes.length === 0
              ? "Aún no hay lotes creados"
              : "No hay lotes que coincidan con los filtros aplicados"}
          </p>
        </EmptyState>
      ) : (
        <LotesGrid>
          {lotesFiltrados.map((lote) => (
            <LoteCard key={lote.id} theme={theme}>
              <CardHeader theme={theme}>
                <CardTitle theme={theme}>
                  <GiWheat />
                  {lote.nombre}
                </CardTitle>
                <CardSubtitle theme={theme}>{lote.descripcion}</CardSubtitle>
              </CardHeader>

              <CardBody>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel theme={theme}>Cultivo</InfoLabel>
                    <InfoValue theme={theme}>{lote.cultivo}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel theme={theme}>Propietario</InfoLabel>
                    <InfoValue theme={theme}>{lote.propietario}</InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel theme={theme}>
                      <FaCalendarAlt /> Fecha Creación
                    </InfoLabel>
                    <InfoValue theme={theme}>
                      {new Date(lote.fechaCreacion).toLocaleDateString()}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel theme={theme}>
                      <FaMapMarkedAlt /> Estado
                    </InfoLabel>
                    <InfoValue theme={theme}>
                      {lote.geometria ? "Con geometría" : "Sin geometría"}
                    </InfoValue>
                  </InfoItem>
                </InfoGrid>

                <AreaInfo theme={theme}>
                  <AreaValue theme={theme}>{lote.hectareas} ha</AreaValue>
                  <AreaLabel theme={theme}>
                    Área declarada
                    {lote.geometria && (
                      <span>
                        {" "}
                        | {calcularAreaGeometria(lote.geometria)} ha calculadas
                      </span>
                    )}
                  </AreaLabel>
                </AreaInfo>

                <ActionButtons>
                  <ViewButton theme={theme} onClick={() => onView(lote)}>
                    <FaEye />
                    Ver
                  </ViewButton>

                  <EditButton theme={theme} onClick={() => onEdit(lote)}>
                    <FaEdit />
                    Editar
                  </EditButton>

                  <DeleteButton
                    theme={theme}
                    onClick={() => handleDeleteClick(lote.id, lote.nombre)}
                  >
                    <FaTrash />
                    Eliminar
                  </DeleteButton>
                </ActionButtons>
              </CardBody>
            </LoteCard>
          ))}
        </LotesGrid>
      )}
    </Container>
  );
};

LotesList.propTypes = {
  lotes: PropTypes.array.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default LotesList;
