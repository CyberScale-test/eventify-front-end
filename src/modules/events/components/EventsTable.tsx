import Routes from '@common/defs/routes';
import ItemsTable from '@common/components/partials/ItemsTable';
import useEvents, { CreateOneInput, UpdateOneInput } from '@modules/events/hooks/api/useEvents';
import dayjs from 'dayjs';
import Namespaces from '@common/defs/namespaces';
import { GridColumns } from '@mui/x-data-grid';
import { Event } from '@modules/events/defs/types';
import { useTranslation } from 'react-i18next';

interface Row {
  id: number;
  title: string;
  date: string;
  location: string;
}

const EventsTable = () => {
  const { t } = useTranslation(['event']);
  const columns: GridColumns<Row> = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
    },
    {
      field: 'title',
      headerName: t('event:list.title'),
      flex: 1,
    },
    {
      field: 'date',
      headerName: t('event:list.date'),
      type: 'dateTime',
      flex: 1,
      renderCell: (params) =>
        params.row.date ? dayjs(params.row.date).format('DD/MM/YYYY hh:mm') : 'No date available',
    },
    {
      field: 'location',
      headerName: t('event:list.location'),
      flex: 1,
    },
  ];

  const itemToRow = (item: Event): Row => ({
    id: item.id,
    title: item.title,
    date: item.date ? item.date.toISOString() : '', // to validate its type.
    location: item.location,
  });

  return (
    <ItemsTable<Event, CreateOneInput, UpdateOneInput, Row>
      namespace={Namespaces.Events}
      routes={Routes.Events}
      useItems={useEvents}
      columns={columns}
      itemToRow={itemToRow}
      showEdit={() => true}
      showDelete={() => true}
    />
  );
};

export default EventsTable;
