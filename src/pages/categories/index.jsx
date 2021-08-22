import { useState, useEffect } from 'react';
// material
import { Stack, Container, Typography, Grid } from '@material-ui/core';

// Components
import { NotificationManager } from 'react-notifications';

import api from '../../services/api';
import CategoryForm from './category-form';
import CategoryList from './category-list';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    try {
      const response = await api.get('api/categories');
      setCategories(response.data);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  }

  async function handleSave(values) {
    try {
      if (isEditing) {
        const category = await api.put(
          `api/categories/${values.id}`,
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
        const category = await api.post(
          'api/categories',
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
      getCategories();
      setCategory(null);
      NotificationManager.success(
        `Categoria ${isEditing ? 'salva ' : 'cadastrada '} com sucesso.`,
        'Sucesso!',
        6000
      );
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  }

  function handleEdit(idCategory) {
    const category = categories.find((s) => s.id === idCategory);
    setCategory(category);
    setIsEditing(true);
  }

  async function handleDelete(idCategory) {
    try {
      const deleted = await api.put(
        `api/categories/${idCategory}`,
        JSON.stringify({
          status: false
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      getCategories();
      NotificationManager.success('Categoria excluída com sucesso.', 'Sucesso!', 6000);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  }

  async function handleDeleteSelected(selected) {
    try {
      await api.put(
        'api/categories/many',
        JSON.stringify({
          ids: [...selected]
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      getCategories();
      NotificationManager.success('Categorias excluídas com sucesso.', 'Sucesso!', 6000);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Categorias
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        <CategoryForm save={handleSave} isEditing={isEditing} category={category} />
        <CategoryList
          categories={categories}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onDeleteSelected={handleDeleteSelected}
        />
      </Grid>
    </Container>
  );
}
