import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import { GiSpray } from 'react-icons/gi';

const Container = styled.div`
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border: 2px solid #e1e8ed;
  border-radius: 25px;
  outline: none;
  width: 300px;

  &:focus {
    border-color: #4a7c59;
  }
`;

const Button = styled.button`
  background: #4a7c59;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #2d5016;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const StatusBadge = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: bold;
  color: white;
  background: #27ae60;
`;

const CardTitle = styled.h3`
  margin: 0 60px 15px 0;
  color: #2c3e50;
`;

const ActionButton = styled.button`
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2em;
  color: #7f8c8d;
`;

const FumigacionesList = ({
  fumigaciones = [],
  isLoading = false,
  onEdit,
  onDelete,
  onView,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFumigaciones = fumigaciones.filter(
    f =>
      f.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.campo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.producto?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Container>
        <LoadingState>
          <GiSpray size={30} />
          <span style={{ marginLeft: '10px' }}>Cargando...</span>
        </LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <GiSpray size={30} />
          Fumigaciones
        </Title>

        <Controls>
          <SearchInput
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {onAdd && (
            <Button onClick={onAdd}>
              <FaPlus /> Nueva
            </Button>
          )}
        </Controls>
      </Header>

      {filteredFumigaciones.length === 0 ? (
        <EmptyState>
          <GiSpray size={80} color="#bdc3c7" />
          <h3>No hay fumigaciones</h3>
          <p>
            {searchTerm
              ? 'No hay resultados para tu búsqueda'
              : 'Aún no hay fumigaciones registradas'}
          </p>
        </EmptyState>
      ) : (
        <Grid>
          {filteredFumigaciones.map(fumigacion => (
            <Card key={fumigacion.id}>
              <StatusBadge>{fumigacion.estado}</StatusBadge>
              <CardTitle>{fumigacion.nombre}</CardTitle>
              <p>
                <strong>Campo:</strong> {fumigacion.campo || 'N/A'}
              </p>
              <p>
                <strong>Producto:</strong> {fumigacion.producto || 'N/A'}
              </p>

              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                {onView && (
                  <ActionButton
                    style={{ background: '#3498db' }}
                    onClick={() => onView(fumigacion)}
                  >
                    <FaEye />
                  </ActionButton>
                )}
                {onEdit && (
                  <ActionButton
                    style={{ background: '#f39c12' }}
                    onClick={() => onEdit(fumigacion)}
                  >
                    <FaEdit />
                  </ActionButton>
                )}
                {onDelete && (
                  <ActionButton
                    style={{ background: '#e74c3c' }}
                    onClick={() => {
                      if (window.confirm('¿Eliminar fumigación?'))
                        onDelete(fumigacion.id);
                    }}
                  >
                    <FaTrash />
                  </ActionButton>
                )}
              </div>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FumigacionesList;
