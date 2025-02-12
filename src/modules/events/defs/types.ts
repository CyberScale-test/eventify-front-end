import { CrudObject } from '@common/defs/types';
import { Dayjs } from 'dayjs';

export interface Event extends CrudObject {
  title: string;
  start_time: Dayjs | null | undefined;
  end_time: Dayjs | null | undefined;
  location: string;
  capacity: number;
  description: string;
}
