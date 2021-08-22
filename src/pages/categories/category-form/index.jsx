import { useEffect } from 'react';
import propTypes from 'prop-types';
// material
import { Stack, TextField, Typography, Card, Grid } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

export default function CategoryForm({ save, isEditing, category }) {
  // Formik validation
  const CategorySchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Nome da categoria é muito pequeno!')
      .max(80, 'Nome da categoria é muito grande!')
      .required('Categoria é obrigatório')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      id: null
    },
    validationSchema: CategorySchema,
    onSubmit: saveCategory
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

  function saveCategory() {
    save(formik.values);
    formik.resetForm();
  }

  useEffect(() => {
    if (isEditing && category && !values.id) {
      formik.setValues({
        id: category.id,
        name: category.name
      });
    }
  }, [isEditing, category]);

  return (
    <Grid item xs={12} md={6} lg={4}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card style={{ padding: 20 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h5" gutterBottom>
                Cadastrar nova
              </Typography>
            </Stack>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Nome da categoria"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                  value={values.name}
                />
              </Stack>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Salvar
              </LoadingButton>
            </Stack>
          </Card>
        </Form>
      </FormikProvider>
    </Grid>
  );
}

CategoryForm.propTypes = {
  save: propTypes.func,
  category: propTypes.object,
  isEditing: propTypes.bool
};
