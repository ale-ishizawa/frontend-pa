import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import propTypes from 'prop-types';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function MoreMenu({ onDelete, onEdit }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleDelete() {
    onDelete();
    setIsOpen(false);
  }

  function handleEdit() {
    onEdit();
    setIsOpen(false);
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} on>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Excluir"
            primaryTypographyProps={{ variant: 'body2' }}
            onClick={handleDelete}
          />
        </MenuItem>

        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Editar"
            primaryTypographyProps={{ variant: 'body2' }}
            onClick={handleEdit}
          />
        </MenuItem>
      </Menu>
    </>
  );
}

MoreMenu.propTypes = {
  onDelete: propTypes.func.isRequired,
  onEdit: propTypes.func.isRequired
};
