import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { filter } from 'lodash';
// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Container,
  Typography,
  Button,
  Icon,
  Card,
  Grid,
  TableContainer,
  TablePagination,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Table,
  Avatar
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { sentenceCase } from 'change-case';

// Components
import { NotificationManager } from 'react-notifications';
import MoreMenu from '../components/MoreMenu';
import SearchNotFound from '../components/SearchNotFound';
import Scrollbar from '../components/Scrollbar';
import TableListHead from '../components/table/table-head';
import Label from '../components/Label';
import api from '../services/api';

const TABLE_HEAD = [
  { id: 'name', label: 'Nome', alignRight: false },
  { id: 'actions', label: 'Ações', alignRight: true }
];

export default function Sectors() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [name, setName] = useState('');
  const [sectors, setSectors] = useState([]);

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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

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

  async function saveSector() {
    try {
      const sector = await api.post(
        'api/sectors',
        JSON.stringify({
          name: formik.values.name
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      formik.resetForm();
      getSectors();
      NotificationManager.success('Setor salvo!', 'Sucesso', 6000);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = sectors.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleClick() {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
  }
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sectors.length) : 0;

  const filteredSectors = applySortFilter(sectors, getComparator(order, orderBy), filterName);

  const isSectorNotFound = filteredSectors.length === 0;

  function handleEdit(idSector) {
    console.log(idSector);
    const sector = sectors.find((s) => s.id === idSector);
    formik.values.name = sector.name;
    formik.values.id = sector.id;
  }

  function handleDelete(idSector) {
    console.log('delete');
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Setores
        </Typography>
      </Stack>
      <Grid container spacing={3}>
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
                      defaultValue=""
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
        <Grid item xs={12} md={6} lg={8}>
          <Card style={{ padding: 20 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h5" gutterBottom>
                Lista
              </Typography>
            </Stack>
            <Scrollbar>
              <TableContainer>
                <Table>
                  <TableListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={sectors.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredSectors
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const { id, name } = row;
                        const isItemSelected = selected.indexOf(name) !== -1;

                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, name)}
                              />
                            </TableCell>
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  {name}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="right">
                              <MoreMenu
                                onDelete={() => handleDelete(id)}
                                onEdit={() => handleEdit(id)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  {isSectorNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={sectors.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
