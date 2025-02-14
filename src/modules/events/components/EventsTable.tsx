/* eslint-disable no-alert */
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
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import useAuth from '@modules/auth/hooks/api/useAuth';
import useApi from '@common/hooks/useApi';
import useParticipatedEvents from '@modules/events/hooks/useParticipatedEvents';

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
  const { user } = useAuth(); // the logged-in user
  const { fetchParticipatedEvents } = useParticipatedEvents();
  const [participatedEventIds, setParticipatedEventIds] = useState<number[]>([]); // for later
  const fetchApi = useApi();

  const columns: GridColumns<Row> = [
    {
      field: 'title',
      headerName: t('event:list.title'),
      flex: 1,
      renderCell: (params) => (
        <span
          style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
          onClick={() => router.push(`/events/${params.row.id}`)}
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
    {
      field: 'participate',
      headerName: 'Participate',
      flex: 1,
      renderCell: (params) => {
        const eventId = params.row.id;
        const hasParticipated = participatedEventIds.includes(eventId);

        return (
          <Button
            variant="contained"
            color={hasParticipated ? 'secondary' : 'primary'}
            onClick={() => handleParticipate(eventId)}
            disabled={hasParticipated} //  for later disable if already participated
          >
            {hasParticipated ? 'Participated' : 'Participate'}
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    if (user) {
      console.log('Fetching participated events for user:', { userId: user.id });
      fetchParticipatedEvents(user.id)
        .then((ids) => {
          // Ensure ids is an array of numbers
          const validIds = Array.isArray(ids) ? ids.filter((id) => typeof id === 'number') : [];
          console.log('Fetched participated events:', { participatedEventIds: validIds });
          setParticipatedEventIds(validIds); // Set only valid IDs
        })
        .catch((error) => {
          console.error('Failed to fetch participated events:', error);
          setParticipatedEventIds([]); // Reset to an empty array on error
        });
    }
  }, [user, fetchParticipatedEvents]);

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
