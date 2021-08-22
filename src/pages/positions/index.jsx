import { useState, useEffect } from 'react';
// material
import { Stack, Container, Typography, Grid } from '@material-ui/core';

// Components
import { NotificationManager } from 'react-notifications';

import api from '../../services/api';
import PositionForm from './position-form';
import PositionList from './position-list';

export default function Sectors() {
  const [positions, setPositions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    getPositions();
  }, []);

  async function getPositions() {
    try {
      const response = await api.get('api/positions');
      setPositions(response.data);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  }

  async function handleSave(values) {
    try {
      if (isEditing) {
        const position = await api.put(
          `api/positions/${values.id}`,
          JSON.stringify({
            name: values.name
          }),
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        setIsEditing(false);
      } else {
        const position = await api.post(
          'api/positions',
          JSON.stringify({
            name: values.name
          }),
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
      getPositions();
      setPosition(null);
      NotificationManager.success(
        `Cargo ${isEditing ? 'salvo ' : 'cadastrado '} com sucesso.`,
        'Sucesso!',
        6000
      );
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  }

  function handleEdit(idPosition) {
    const position = positions.find((s) => s.id === idPosition);
    setPosition(position);
    setIsEditing(true);
  }

  async function handleDelete(idPosition) {
    try {
      const deleted = await api.put(
        `api/positions/${idPosition}`,
        JSON.stringify({
          status: false
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      getPositions();
      NotificationManager.success('Cargo excluído com sucesso.', 'Sucesso!', 6000);
    } catch (error) {
      NotificationManager.error('Erro', 'Erro', 6000);
    }
  }

  async function handleDeleteSelected(selected) {
    try {
      await api.put(
        'api/positions/many',
        JSON.stringify({
          ids: [...selected]
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      getPositions();
      NotificationManager.success('Cargos excluídos com sucesso.', 'Sucesso!', 6000);
    } catch (error) {
      NotificationManager.error('Erro ao excluir vários cargos.', 'Erro', 6000);
    }
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Cargos
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        <PositionForm save={handleSave} isEditing={isEditing} position={position} />
        <PositionList
          positions={positions}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onDeleteSelected={handleDeleteSelected}
        />
      </Grid>
    </Container>
  );
}
