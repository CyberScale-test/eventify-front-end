import Routes from '@common/defs/routes';
import { CRUD_ACTION, NavGroup } from '@common/defs/types';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import Namespaces from '@common/defs/namespaces';
import { Group } from '@mui/icons-material';
import FestivalIcon from '@mui/icons-material/Festival';
import TodayIcon from '@mui/icons-material/Today';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';

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
      {
        text: 'My Events',
        icon: <TodayIcon />,
        link: '/users/my-events',
        namespace: Namespaces.Events,
        permission: CRUD_ACTION.READ,
      },
      {
        text: 'My Bookings',
        icon: <AirlineSeatReclineNormalIcon />,
        link: 'users/my-bookings',
        namespace: Namespaces.Events,
        permission: CRUD_ACTION.READ,
      },
    ],
  },
];
