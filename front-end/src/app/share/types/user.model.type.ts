import { userRole } from './user-role.type';

export type User = {
  id: number;

  email: string;

  first_name: string;

  last_name: string;

  role: userRole;

  full_name: string;
};
