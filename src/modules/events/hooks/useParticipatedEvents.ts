import useApi from '@common/hooks/useApi';
import { useEffect, useState } from 'react';
import { Event } from '@modules/events/defs/types';

interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  totalItems: number;
  perPage: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    items: Event[];
    meta: PaginationMeta;
  };
  errors?: string[];
}

const useParticipatedEvents = (userId: number | undefined) => {
  const fetchApi = useApi();
  const [events, setEvents] = useState<Event[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (userId) {
          // fetch participated events with pagination
          const response = await fetchApi<ApiResponse>(
            `/users/${userId}/participated-events?page=${currentPage}&perPage=${pageSize}`
          );

          if (response.success) {
            // access nested properties
            setEvents(response.data?.items || []);
            setPaginationMeta(response.data?.meta || null);
          } else {
            setError(response.errors?.[0] || 'Failed to fetch participated events');
          }
        }
      } catch (err) {
        setError((err as Error).message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId, currentPage, pageSize, fetchApi]);

  return { events, paginationMeta, loading, error, setCurrentPage, setPageSize };
};

export default useParticipatedEvents;
