// hooks/useParticipatedEvents.ts
import useApi from '@common/hooks/useApi';
import { useCallback } from 'react';

const useParticipatedEvents = () => {
  const fetchApi = useApi();

  const fetchParticipatedEvents = useCallback(
    async (userId: number) => {
      try {
        const response = await fetchApi(`/users/${userId}/participated-events`, {
          method: 'GET',
        });

        if (response.success) {
          return response.data; // Return the list of participated event IDs
        }
        throw new Error(response.errors?.[0] || 'Failed to fetch participated events.');
      } catch (error) {
        console.error('Error fetching participated events:', error);
        throw error;
      }
    },
    [fetchApi]
  );

  return { fetchParticipatedEvents };
};

export default useParticipatedEvents;
