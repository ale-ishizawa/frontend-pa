import { useEffect } from 'react';
import propTypes from 'prop-types';
// material
import { Stack, TextField, Typography, Card, Grid, Container } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

export default function EmployeeForm({ save, isEditing, employee }) {
  // Formik validation
  const EmployeeSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Nome é muito pequeno!')
      .max(60, 'Nome é muito grande!')
      .required('Nome é obrigatório'),
    email: Yup.string()
      .email('Email inválido!')
      .max(120, 'Email é muito grande!')
      .required('Email é obrigatório'),
    birth: Yup.date().required('Data de nascimento é obrigatório'),
    admission: Yup.date(),
    resignation: Yup.date()
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      birth: '',
      id: null
    },
    validationSchema: EmployeeSchema,
    onSubmit: saveEmployee
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

  function saveEmployee() {
    save(formik.values);
    formik.resetForm();
  }

  useEffect(() => {
    if (isEditing && employee && !values.id) {
      formik.setValues({
        id: employee.id,
        name: employee.name
      });
    }
  }, [isEditing, employee]);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Cadastrar novo funcionário
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={12}>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Card style={{ padding: 20 }}>
                {/* <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                  <Typography variant="h5" gutterBottom>
                    Cadastrar nova
                  </Typography>
                  
                </Stack> */}
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Nome"
                      {...getFieldProps('name')}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                      value={values.name}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      {...getFieldProps('email')}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                      value={values.email}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Data de nascimento"
                      {...getFieldProps('birth')}
                      error={Boolean(touched.birth && errors.birth)}
                      helperText={touched.birth && errors.birth}
                      value={values.birth}
                      type="date"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Admissão"
                      {...getFieldProps('admission')}
                      error={Boolean(touched.admission && errors.admission)}
                      helperText={touched.admission && errors.admission}
                      value={values.admission}
                    />
                    <TextField
                      fullWidth
                      label="Demissão"
                      {...getFieldProps('resignation')}
                      error={Boolean(touched.resignation && errors.resignation)}
                      helperText={touched.resignation && errors.resignation}
                      value={values.resignation}
                    />
                  </Stack>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="flex-end"
                  >
                    <LoadingButton
                      size="large"
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      Salvar
                    </LoadingButton>
                  </Stack>
                </Stack>
              </Card>
            </Form>
          </FormikProvider>
        </Grid>
      </Grid>
    </Container>
  );
}

EmployeeForm.propTypes = {
  save: propTypes.func,
  employee: propTypes.object,
  isEditing: propTypes.bool
};
