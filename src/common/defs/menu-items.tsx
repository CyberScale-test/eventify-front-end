import Routes from '@common/defs/routes';
import { CRUD_ACTION, NavGroup } from '@common/defs/types';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import Namespaces from '@common/defs/namespaces';
import { Group } from '@mui/icons-material';
import FestivalIcon from '@mui/icons-material/Festival';

export const menuItems: NavGroup[] = [
  {
    text: 'Gestion',
    items: [
      {
        text: 'Dashboard',
        icon: <DashboardCustomizeRoundedIcon />,
        link: Routes.Common.Home,
      },
      {
        text: 'Users',
        icon: <Group />,
        link: Routes.Users.ReadAll,
        namespace: Namespaces.Users,
        permission: CRUD_ACTION.READ,
        routes: Routes.Users,
      },
      {
        text: 'Events',
        icon: <FestivalIcon />,
        link: Routes.Events.ReadAll,
        namespace: Namespaces.Events,
        permission: CRUD_ACTION.READ,
        routes: Routes.Events,
      },
    ],
  },
];
