import { useEffect, useState } from 'react';
import ItemsTable from '@common/components/partials/ItemsTable';
import useEvents from '@modules/events/hooks/api/useEvents';
import Namespaces from '@common/defs/namespaces';
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid';
import { Event } from '@modules/events/defs/types';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { CrudRow } from '@common/defs/types';
import { useDataContext } from '@common/contexts/DataContext';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import useAuth from '@modules/auth/hooks/api/useAuth';
import useParticipatedEvents from '@modules/events/hooks/useParticipatedEvents';
import useApi from '@common/hooks/useApi';
import Routes from '@common/defs/routes';

interface Row extends CrudRow {
  title: string;
  start_time: Dayjs | null;
  end_time: Dayjs | null;
  location: string;
  capacity: number;
  description: string;
  city_name: string;
}

const EventsTable = () => {
  const { t } = useTranslation(['event']);
  const { data } = useDataContext();
  const router = useRouter();
  const cities = data?.cities || [];
  const { user } = useAuth();
  const {
    events: participatedEvents,
    loading: participatedLoading,
    error: participatedError,
  } = useParticipatedEvents(user?.id);
  const [participatedEventIds, setParticipatedEventIds] = useState<number[]>([]);
  const fetchApi = useApi();

  useEffect(() => {
    if (participatedEvents) {
      const ids = participatedEvents.map((event) => event.id);
      setParticipatedEventIds(ids);
    }
  }, [participatedEvents]);

  const columns: GridColumns = [
    {
      field: 'title',
      headerName: t('event:list.title'),
      flex: 1,
      renderCell: (params) => (
        <span
          style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
          onClick={() => router.push(`/events/show/${params.row.id}`)}
        >
          {params.row.title}
        </span>
      ),
    },
    {
      field: 'start_time',
      headerName: t('event:list.start_time'),
      type: 'dateTime',
      flex: 1,
    },
    {
      field: 'end_time',
      headerName: t('event:list.end_time'),
      type: 'dateTime',
      flex: 1,
      renderCell: (params) =>
        params.row.end_time
          ? dayjs(params.row.end_time).format('DD/MM/YYYY HH:mm')
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
    {
      field: 'participate',
      headerName: 'Participate',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const eventId = params.row.id;
        const hasParticipated = participatedEventIds.includes(eventId);

        return (
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click when clicking the button
              handleParticipate(eventId);
            }}
            disabled={hasParticipated}
            variant="contained"
            color="primary"
            sx={{
              pointerEvents: hasParticipated ? 'none' : 'auto',
            }}
          >
            {hasParticipated ? 'Participated' : 'Participate'}
          </Button>
        );
      },
    },
  ];

  const handleParticipate = async (eventId: number) => {
    if (!user) {
      alert('You must be logged in to participate in an event.');
      return;
    }
    try {
      console.log(`Attempting to participate in event ID ${eventId}`);
      const response = await fetchApi(`/events/${eventId}/participate`, {
        method: 'POST',
        data: { userId: user.id },
        displaySuccess: true,
        displayProgress: true,
      });
      console.log('API response:', response);
      if (response.success) {
        alert('You have successfully participated in the event!');
        setParticipatedEventIds((prev) => [...prev, eventId]);
      } else {
        alert(response.errors?.[0] || 'Failed to participate in the event.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while participating.');
    }
  };

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
      city_name: city ? city.name : 'Unknown',
    };
  };

  return (
    <ItemsTable
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
