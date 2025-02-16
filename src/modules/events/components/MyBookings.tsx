import {
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Box,
  Pagination,
  Button,
  Tooltip,
} from '@mui/material';
import dayjs from 'dayjs';
import useAuth from '@modules/auth/hooks/api/useAuth';
import useParticipatedEvents from '@modules/events/hooks/useParticipatedEvents';
import { useNotifications } from '@common/contexts/NotificationContext';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MyBookings = () => {
  const { user } = useAuth();
  const { events, paginationMeta, loading, error, setCurrentPage } = useParticipatedEvents(
    user?.id
  );
  const { subscribeToEventChannel } = useNotifications();
  const { t } = useTranslation(['event', 'common']);

  useEffect(() => {
    if (events.length > 0) {
      const unsubscribes = events
        .map((event) => subscribeToEventChannel(event.id))
        .filter((unsubscribe): unsubscribe is () => void => typeof unsubscribe === 'function');

      return () => {
        unsubscribes.forEach((unsubscribe) => unsubscribe());
      };
    }
  }, [events]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">
          {t('common:error_occurred')}
        </Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      {/* Header */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        {t('event:my_bookings')}
      </Typography>

      {/* Bookings List */}
      {events.length > 0 ? (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardContent>
                  {/* Title */}
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      textAlign: 'center',
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                    }}
                  >
                    {event.title}
                  </Typography>

                  {/* Key-Value Pairs */}
                  <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                    <span style={{ fontWeight: 'bold', color: 'text.secondary' }}>Start Date:</span>
                    <span>{dayjs(event.startTime).format('DD/MM/YYYY')}</span>
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                    <span style={{ fontWeight: 'bold', color: 'text.secondary' }}>End Date:</span>
                    <span>{dayjs(event.endTime).format('DD/MM/YYYY')}</span>
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                    <span style={{ fontWeight: 'bold', color: 'text.secondary' }}>Location:</span>
                    <span style={{ fontWeight: 'bold', color: 'text.secondary' }}>
                      {event.location}
                    </span>
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                    <span style={{ fontWeight: 'bold', color: 'text.secondary' }}>Capacity:</span>
                    <span>{event.capacity}</span>
                  </Typography>

                  {/* Cancel Booking Button */}
                  <Box mt={2} display="flex" justifyContent="center">
                    <Tooltip title="Cancel Booking">
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => alert(`Cancel booking for event: ${event.title}`)}
                        sx={{
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'error.dark',
                          },
                        }}
                      >
                        {t('event:cancel_booking')}
                      </Button>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">{t('event:no_bookings_found')}</Typography>
        </Box>
      )}

      {/* Pagination */}
      {paginationMeta && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={paginationMeta.lastPage}
            page={paginationMeta.currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default MyBookings;
