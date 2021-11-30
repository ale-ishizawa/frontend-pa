import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Funcionários',
    icon: getIcon(peopleFill),
    children: [
      {
        title: 'Cadastrar',
        path: '/dashboard/employees/create'
      },
      {
        title: 'Lista',
        path: '/dashboard/employees'
      }
    ]
  },
  {
    title: 'Teste DISC',
    path: '/dashboard/disc',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Setores',
    path: '/dashboard/sectors',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Cargos',
    path: '/dashboard/positions',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Categorias',
    path: '/dashboard/categories',
    icon: getIcon(fileTextFill)
  }
];

export default sidebarConfig;
