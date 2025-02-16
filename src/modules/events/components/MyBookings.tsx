import useAuth from '@modules/auth/hooks/api/useAuth';
import useParticipatedEvents from '@modules/events/hooks/useParticipatedEvents';
import dayjs from 'dayjs';
import { useNotifications } from '@common/contexts/NotificationContext';
import { useEffect } from 'react';
import {
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Box,
  Pagination,
} from '@mui/material';

const MyBookings = () => {
  const { user } = useAuth();
  const { events, paginationMeta, loading, error, setCurrentPage } = useParticipatedEvents(
    user?.id
  );
  const { subscribeToEventChannel } = useNotifications();

  useEffect(() => {
    console.log('fetched Events:', events);
    if (events.length > 0) {
      const unsubscribes = events
        .map((event) => subscribeToEventChannel(event.id))
        .filter((unsubscribe): unsubscribe is () => void => typeof unsubscribe === 'function');
      // this filter ensures TypeScript knows `unsubscribe` is a function thanks to deepseek

      return () => {
        unsubscribes.forEach((unsubscribe) => unsubscribe()); // now unsubscribe is always callable
      };
    }
  }, [events]);

  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Grid container spacing={2}>
        {events.length > 0 ? (
          events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {event.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {dayjs(event.startTime).format('DD/MM/YYYY')} -{' '}
                    {dayjs(event.endTime).format('DD/MM/YYYY')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Capacity: {event.capacity}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No bookings found.</Typography>
          </Grid>
        )}
      </Grid>
      {paginationMeta && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={paginationMeta.lastPage}
            page={paginationMeta.currentPage}
            onChange={(event, value) => setCurrentPage(value)}
          />
        </Box>
      )}
    </>
  );
};

export default MyBookings;
