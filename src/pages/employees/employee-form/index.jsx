import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import propTypes from 'prop-types';
// material
import {
  Stack,
  TextField,
  Typography,
  Card,
  Grid,
  Container,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import * as Yup from 'yup';
import { NotificationManager } from 'react-notifications';
import { useFormik, Form, FormikProvider } from 'formik';
import { format } from 'date-fns';
import { api } from '../../../services/api';

export default function EmployeeForm() {
  const { id } = useParams();
  console.log('id: ', id);

  const [employee, setEmployee] = useState({});

  /** States */
  const [positions, setPositions] = useState([]);
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    getPositions();
    getSectors();
  }, []);

  useEffect(() => {
    if (id && id > 0) {
      getEmployee(id);
    } else {
      formik.resetForm();
    }
  }, [id]);

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
    admission: Yup.date().required('Data de admissão é obrigatório'),
    resignation: Yup.date().nullable(),
    position: Yup.number().required('Cargo é obrigatório'),
    sector: Yup.number().required('Setor é obrigatório')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      birth: null,
      admission: null,
      resignation: null,
      sector: '',
      position: '',
      id: null,
      discProfile: null
    },
    validationSchema: EmployeeSchema,
    onSubmit: save
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values, setValues } = formik;

  async function getPositions() {
    try {
      const response = await api.get('api/positions');
      setPositions(response.data);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  }

  async function getSectors() {
    try {
      const response = await api.get('api/sectors');
      setSectors(response.data);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  }

  async function getEmployee(id) {
    try {
      const emp = await api.get(`api/employees/${id}`);
      console.log(emp.data.admission);
      setValues({
        id,
        name: emp.data.name,
        admission: format(new Date(emp.data.admission), 'yyyy-MM-dd').toString(),
        birth: format(new Date(emp.data.birth), 'yyyy-MM-dd').toString(),
        email: emp.data.email,
        position: emp.data.positionId,
        resignation: emp.data.resignation
          ? format(new Date(emp.data.resignation), 'yyyy-MM-dd').toString()
          : null,
        sector: emp.data.sectorId,
        discProfile: emp.data.discProfile ? emp.data.discProfile : '0'
      });
      setEmployee(emp.data);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  }

  async function save() {
    try {
      if (id) {
        await api.put(
          `api/employees/${id}`,
          JSON.stringify({
            name: values.name,
            email: values.email,
            birth: values.birth,
            admission: values.admission,
            resignation: values.resignation,
            position_id: values.position,
            sector_id: values.sector
          }),
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        await api.post(
          'api/employees',
          JSON.stringify({
            name: values.name,
            email: values.email,
            birth: values.birth,
            admission: values.admission,
            resignation: values.resignation,
            position_id: values.position,
            sector_id: values.sector,
            disc_profile: values.discProfile === '0' ? null : values.discProfile
          }),
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
      NotificationManager.success(
        `Funcionário ${id ? 'salvo ' : 'cadastrado '} com sucesso.`,
        'Sucesso!',
        6000
      );
      formik.resetForm();
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Funcionários
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={12}>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Card style={{ padding: 20 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                  <Typography variant="h5" gutterBottom>
                    {id ? 'Editar funcionário' : 'Cadastrar novo'}
                  </Typography>
                </Stack>
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
                      value={!values.birth ? '' : values.birth}
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
                      value={!values.admission ? '' : values.admission}
                      type="date"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Demissão"
                      {...getFieldProps('resignation')}
                      error={Boolean(touched.resignation && errors.resignation)}
                      helperText={touched.resignation && errors.resignation}
                      value={!values.resignation ? '' : values.resignation}
                      type="date"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel id="select-position-label">Cargo</InputLabel>
                      <Select
                        labelId="select-position-label"
                        id="select-position"
                        value={values.position}
                        label="Cargo"
                        {...getFieldProps('position')}
                        error={Boolean(touched.position && errors.position)}
                      >
                        <MenuItem value="">
                          <em>Selecione</em>
                        </MenuItem>
                        {positions && positions.length > 0
                          ? positions.map((position) => (
                              <MenuItem key={position.id} value={position.id}>
                                {position.name}
                              </MenuItem>
                            ))
                          : []}
                      </Select>
                      <FormHelperText error={Boolean(touched.position && errors.position)}>
                        {touched.position && errors.position}
                      </FormHelperText>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel id="select-sector-label">Setor</InputLabel>
                      <Select
                        labelId="select-sector-label"
                        id="select-sector"
                        value={values.sector}
                        label="Setor"
                        {...getFieldProps('sector')}
                        error={Boolean(touched.sector && errors.sector)}
                      >
                        <MenuItem value="">
                          <em>Selecione</em>
                        </MenuItem>
                        {sectors && sectors.length > 0
                          ? sectors.map((sector) => (
                              <MenuItem key={sector.id} value={sector.id}>
                                {sector.name}
                              </MenuItem>
                            ))
                          : []}
                      </Select>
                      <FormHelperText error={Boolean(touched.sector && errors.sector)}>
                        {touched.sector && errors.sector}
                      </FormHelperText>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel id="select-disc-label" shrink={values.id}>
                        Perfil DISC
                      </InputLabel>
                      <Select
                        labelId="select-disc-label"
                        id="select-disc"
                        value={values.discProfile}
                        label="Perfil DISC"
                        {...getFieldProps('discProfile')}
                        error={Boolean(touched.discProfile && errors.discProfile)}
                        disabled={values.id}
                      >
                        <MenuItem key="0" value="0">
                          <em>Não realizou o teste</em>
                        </MenuItem>
                        <MenuItem key="D" value="D">
                          Dominância
                        </MenuItem>
                        <MenuItem key="I" value="I">
                          Influência
                        </MenuItem>
                        <MenuItem key="S" value="S">
                          Estabilidade
                        </MenuItem>
                        <MenuItem key="C" value="C">
                          Conformidade
                        </MenuItem>
                      </Select>
                      <FormHelperText error={Boolean(touched.discProfile && errors.discProfile)}>
                        {touched.discProfile && errors.discProfile}
                      </FormHelperText>
                    </FormControl>
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
