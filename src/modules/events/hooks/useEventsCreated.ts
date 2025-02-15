import useApi from '@common/hooks/useApi';
import { useEffect, useState } from 'react';
import { Event } from '@modules/events/defs/types';

interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  totalItems: number;
}

const useEventsCreated = (userId: number | undefined) => {
  const fetchApi = useApi();
  const [events, setEvents] = useState<Event[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (userId) {
          const response = await fetchApi<{ items: Event[]; meta: PaginationMeta }>(
            `/users/${userId}/events?page=${currentPage}&perPage=${pageSize}`
          );
          if (response.success) {
            console.log('created eventd:', response);
            setEvents(response.data?.items || []);
            setPaginationMeta(response.data?.meta || null);
          } else {
            setError(response.errors?.[0] || 'Failed to fetch events');
          }
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId, currentPage, pageSize, fetchApi]);

  return { events, paginationMeta, loading, error, setCurrentPage, setPageSize };
};

export default useEventsCreated;
