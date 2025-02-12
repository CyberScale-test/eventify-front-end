import Routes from '@common/defs/routes';
import ItemsTable from '@common/components/partials/ItemsTable';
import useEvents, { CreateOneInput, UpdateOneInput } from '@modules/events/hooks/api/useEvents';
import Namespaces from '@common/defs/namespaces';
import { GridColumns } from '@mui/x-data-grid';
import { Event } from '@modules/events/defs/types';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { CrudRow } from '@common/defs/types';
import { useDataContext } from '@common/contexts/DataContext';

interface Row extends CrudRow {
  title: string;
  start_time: Dayjs | null;
  end_time: Dayjs | null;
  location: string;
  capacity: number;
  description: string;
  city_name: string;
}

// what appears in browser
const EventsTable = () => {
  const { t } = useTranslation(['event']);
  const { data } = useDataContext();
  const cities = data?.cities || [];

  const columns: GridColumns<Row> = [
    {
      field: 'title',
      headerName: t('event:list.title'),
      flex: 1,
    },
    {
      field: 'start_time',
      headerName: t('event:list.start_time'),
      type: 'dateTime',
      flex: 1,
      renderCell: (params) =>
        params.row.start_time
          ? dayjs(params.row.start_time).format('DD/MM/YYYY hh:mm')
          : 'No date available',
    },
    {
      field: 'end_time',
      headerName: t('event:list.end_time'),
      type: 'dateTime',
      flex: 1,
      renderCell: (params) =>
        params.row.end_time
          ? dayjs(params.row.end_time).format('DD/MM/YYYY hh:mm')
          : 'No date available',
    },
    {
      field: 'location',
      headerName: t('event:list.location'),
      flex: 1,
    },
    {
      field: 'capacity',
      headerName: t('event:list.capacity'),
      flex: 1,
    },
    {
      field: 'city_name',
      headerName: t('event:list.city'),
      flex: 1,
    },
  ];

  const itemToRow = (item: Event): Row => {
    const city = cities.find((city) => city.id === item.cityId);
    return {
      id: item.id,
      title: item.title,
      start_time: item.startTime ? dayjs(item.startTime) : null,
      end_time: item.endTime ? dayjs(item.endTime) : null,
      location: item.location,
      capacity: item.capacity,
      description: item.description,
      city_name: city ? city.name : 'Unknownn',
    };
  };

  return (
    <ItemsTable<Event, CreateOneInput, UpdateOneInput, Row>
      namespace={Namespaces.Events}
      routes={Routes.Events}
      useItems={useEvents}
      columns={columns}
      itemToRow={itemToRow}
      showEdit={() => true}
      showDelete={() => true}
      showLock
    />
  );
};

export default EventsTable;
