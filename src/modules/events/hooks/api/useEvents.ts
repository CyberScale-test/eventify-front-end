import ApiRoutes from '@common/defs/api-routes';
import { Event } from '@modules/events/defs/types';
import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';
import { Dayjs } from 'dayjs';

export interface CreateOneInput {
  title: string;
  description: string;
  start_time: Dayjs | null | undefined;
  end_time: Dayjs | null | undefined;
  location: string;
  capacity: number;
  city_id: number | null;
}

export interface UpdateOneInput {
  title?: string;
  description: string;
  startTime: Dayjs | null | undefined;
  endTime: Dayjs | null | undefined;
  location?: string;
  capacity: number;
  cityId: number | null;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useEvents: UseItems<Event, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Events;
  const useItemsHook = useItems<Event, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useEvents;
