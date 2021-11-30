import { useState, useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { format } from 'date-fns';
// material
import {
  Stack,
  Typography,
  Card,
  Grid,
  TableContainer,
  TablePagination,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Table
} from '@material-ui/core';
import TableListToolbar from '../../../components/TableListToolbar';
import MoreMenu from '../../../components/MoreMenu';
import SearchNotFound from '../../../components/SearchNotFound';
import Scrollbar from '../../../components/Scrollbar';
import TableListHead from '../../../components/TableListHead';
import { applySortFilter, getComparator } from '../../../utils/tableFunctions';
import { api } from '../../../services/api';

const TABLE_HEAD = [
  { id: 'name', label: 'Nome', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'birth', label: 'Data de Nascimento', alignRight: false },
  { id: 'admission', label: 'Data de Admissão', alignRight: false },
  { id: 'resignation', label: 'Data de Demissão', alignRight: false },
  { id: 'position', label: 'Cargo', alignRight: false },
  { id: 'sector', label: 'Setor', alignRight: false },
  { id: 'disc_profile', label: 'Perfil DISC', alignRight: false },
  { id: 'actions', label: 'Ações', alignRight: true }
];

export default function EmployeeList() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getEmployees();
  }, []);

  async function getEmployees() {
    try {
      const response = await api.get('api/employees');
      setEmployees(response.data);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDeleteSelected = async () => {
    try {
      await api.put(
        'api/employees/many',
        JSON.stringify({
          ids: [...selected]
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      getEmployees();
      setSelected([]);
      NotificationManager.success('Funcionários inativados com sucesso.', 'Sucesso!', 6000);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  };

  const handleDelete = async (idEmployee) => {
    try {
      const deleted = await api.put(
        `api/employees/${idEmployee}`,
        JSON.stringify({
          status: false
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      getEmployees();
      NotificationManager.success('Funcionário inativado com sucesso.', 'Sucesso!', 6000);
    } catch (error) {
      NotificationManager.error(error.message, 'Erro', 6000);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = async (event) => {
    if (event.target.checked) {
      if (isEmployeeNotFound) {
        return;
      }
      const newSelecteds = employees.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0;

  const filteredEmployees = applySortFilter(employees, getComparator(order, orderBy), filterName);

  const isEmployeeNotFound = filteredEmployees.length === 0;

  return (
    <Grid item xs={12} md={12} lg={12}>
      <Card style={{ padding: 20 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h5" gutterBottom>
            Funcionários ativos
          </Typography>
        </Stack>
        <TableListToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSelected={handleDeleteSelected}
        />
        <Scrollbar>
          <TableContainer>
            <Table>
              <TableListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={employees.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredEmployees
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const {
                      id,
                      name,
                      email,
                      birth,
                      admission,
                      resignation,
                      positionName,
                      sectorName,
                      /* eslint-disable camelcase */
                      disc_profile
                    } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;

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
                            onChange={(event) => handleClick(event, id)}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {email}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {format(new Date(birth), 'dd/MM/yyyy')}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {format(new Date(admission), 'dd/MM/yyyy')}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {resignation ? format(new Date(resignation), 'dd/MM/yyyy') : '-'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {positionName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {sectorName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {disc_profile === 'D' && 'Dominância'}
                              {disc_profile === 'I' && 'Influência'}
                              {disc_profile === 'S' && 'Estabilidade'}
                              {disc_profile === 'C' && 'Conformidade'}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="right">
                          <MoreMenu
                            onDelete={() => handleDelete(id)}
                            urlEdit={`/dashboard/employees/edit/${id}`}
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
              {isEmployeeNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
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
          labelRowsPerPage="Quantidade por página"
          component="div"
          count={employees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Grid>
  );
}
