import { ROLE } from '@modules/permissions/defs/types';

// try to fetch this later dynamically from the back-end.
export const ROLES_OPTIONS = [
  { value: ROLE.ADMIN, label: 'common:admin_role' },
  { value: ROLE.USER, label: 'common:user_role' },
];
