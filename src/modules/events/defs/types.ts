import { CrudObject } from '@common/defs/types';
import { User } from '@modules/users/defs/types';
import { Dayjs } from 'dayjs';

export interface Event extends CrudObject {
  title: string;
  date: Dayjs | null | undefined;
  location: string;
  max: number;
  userId: string;
  user: User;
}
