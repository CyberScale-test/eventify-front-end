import ApiRoutes from '@common/defs/api-routes';
import { Event } from '@modules/events/defs/types';
import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';
import { Id } from '@common/defs/types';
import { Dayjs } from 'dayjs';

export interface CreateOneInput {
  title: string;
  date: Dayjs | null | undefined;
  location: string;
  max: number;
  userId: Id;
}

export interface UpdateOneInput {
  title?: string;
  date?: Dayjs | null | undefined;
  location?: string;
  max: number;
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
