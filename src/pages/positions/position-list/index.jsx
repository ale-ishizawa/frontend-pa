import { useState } from 'react';
import propTypes from 'prop-types';
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

const TABLE_HEAD = [
  { id: 'name', label: 'Nome', alignRight: false },
  { id: 'actions', label: 'Ações', alignRight: true }
];

export default function PositionList({ positions = [], onEdit, onDelete, onDeleteSelected }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function handleOnDeleteSelected() {
    onDeleteSelected(selected);
    setSelected([]);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      if (isPositionNotFound) {
        return;
      }
      const newSelecteds = positions.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - positions.length) : 0;

  const filteredPositions = applySortFilter(positions, getComparator(order, orderBy), filterName);

  const isPositionNotFound = filteredPositions.length === 0;

  return (
    <Grid item xs={12} md={6} lg={8}>
      <Card style={{ padding: 20 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h5" gutterBottom>
            Lista
          </Typography>
        </Stack>
        <TableListToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSelected={handleOnDeleteSelected}
        />
        <Scrollbar>
          <TableContainer>
            <Table>
              <TableListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={positions.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredPositions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { id, name } = row;
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

                        <TableCell align="right">
                          <MoreMenu onDelete={() => onDelete(id)} onEdit={() => onEdit(id)} />
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
              {isPositionNotFound && (
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
          labelRowsPerPage="Quantidade por página"
          component="div"
          count={positions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Grid>
  );
}

PositionList.propTypes = {
  positions: propTypes.array,
  onEdit: propTypes.func,
  onDelete: propTypes.func,
  onDeleteSelected: propTypes.func
};
