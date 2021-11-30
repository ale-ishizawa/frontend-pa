import { useState, useEffect } from 'react';
// material
import { Stack, Container, Typography, Grid } from '@material-ui/core';

// Components
import { NotificationManager } from 'react-notifications';

import { api } from '../../services/api';
import SectorForm from './sector-form';
import SectorList from './sector-list';

export default function Sectors() {
  const [sectors, setSectors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [sector, setSector] = useState(null);

  useEffect(() => {
    getSectors();
  }, []);

  async function getSectors() {
    try {
      const response = await api.get('api/sectors');
      setSectors(response.data);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  }

  const handleSave = async (values) => {
    try {
      if (isEditing) {
        const sector = await api.put(
          `api/sectors/${values.id}`,
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
        const sector = await api.post(
          'api/sectors',
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
      getSectors();
      setSector(null);
      NotificationManager.success(
        `Setor ${isEditing ? 'salvo ' : 'cadastrado '} com sucesso.`,
        'Sucesso!',
        6000
      );
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  };

  const handleEdit = (idSector) => {
    const sector = sectors.find((s) => s.id === idSector);
    setSector(sector);
    setIsEditing(true);
  };

  const handleDelete = async (idSector) => {
    try {
      const deleted = await api.put(
        `api/sectors/${idSector}`,
        JSON.stringify({
          status: false
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      getSectors();
      NotificationManager.success('Setor excluído com sucesso.', 'Sucesso!', 6000);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  };

  const handleDeleteSelected = async (selected) => {
    try {
      await api.put(
        'api/sectors/many',
        JSON.stringify({
          ids: [...selected]
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      getSectors();
      NotificationManager.success('Setores excluídos com sucesso!.', 'Sucesso', 6000);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Setores
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        <SectorForm save={handleSave} isEditing={isEditing} sector={sector} />
        <SectorList
          sectors={sectors}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onDeleteSelected={handleDeleteSelected}
        />
      </Grid>
    </Container>
  );
}
