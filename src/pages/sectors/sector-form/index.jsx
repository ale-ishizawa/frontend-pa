import { useEffect } from 'react';
import propTypes from 'prop-types';
// material
import { Stack, TextField, Typography, Card, Grid } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

export default function SectorForm({ save, isEditing, sector }) {
  // Formik validation
  const SectorSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Nome do setor muito pequeno!')
      .max(80, 'Nome do setor muito grande!')
      .required('Setor é obrigatório')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      id: null
    },
    validationSchema: SectorSchema,
    onSubmit: saveSector
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

  function saveSector() {
    save(formik.values);
    formik.resetForm();
  }

  useEffect(() => {
    if (isEditing && sector && !values.id) {
      formik.setValues({
        id: sector.id,
        name: sector.name
      });
    }
  }, [isEditing, sector]);

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
                  label="Nome do setor"
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

SectorForm.propTypes = {
  save: propTypes.func,
  sector: propTypes.object,
  isEditing: propTypes.bool
};
