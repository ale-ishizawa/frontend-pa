import { useEffect } from 'react';
import propTypes from 'prop-types';
// material
import { Stack, TextField, Typography, Card, Grid } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

export default function PositionForm({ save, isEditing, position }) {
  // Formik validation
  const PositionSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Nome do cargo é muito pequeno!')
      .max(100, 'Nome do cargo é muito grande!')
      .required('Cargo é obrigatório')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      id: null
    },
    validationSchema: PositionSchema,
    onSubmit: savePosition
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

  function savePosition() {
    save(formik.values);
    formik.resetForm();
  }

  useEffect(() => {
    if (isEditing && position && !values.id) {
      formik.setValues({
        id: position.id,
        name: position.name
      });
    }
  }, [isEditing, position]);

  return (
    <Grid item xs={12} md={6} lg={4}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card style={{ padding: 20 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h5" gutterBottom>
                Cadastrar novo
              </Typography>
            </Stack>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Nome do cargo"
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

PositionForm.propTypes = {
  save: propTypes.func,
  position: propTypes.object,
  isEditing: propTypes.bool
};
