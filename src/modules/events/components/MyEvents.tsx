import {
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Box,
  Pagination,
} from '@mui/material';
import dayjs from 'dayjs';
import useAuth from '@modules/auth/hooks/api/useAuth';
import useEventsCreated from '@modules/events/hooks/useEventsCreated';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import SeeDetails from '@common/components/lib/SeeDetails';

const MyEvents = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation(['event', 'common']);
  const { events, paginationMeta, loading, error, setCurrentPage } = useEventsCreated(user?.id);

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
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        {t('event:my_events')}
      </Typography>

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
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      textAlign: 'center',
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: 'secondary.main',
                      },
                    }}
                    onClick={() => router.push(`/events/show/${event.id}`)}
                  >
                    {event.title}
                  </Typography>

                  <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                    <span style={{ fontWeight: 'bold', color: 'text.secondary' }}>Start Date:</span>
                    <span>{dayjs(event.startTime).format('DD/MM/YYYY HH:mm')}</span>
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                    <span style={{ fontWeight: 'bold', color: 'text.secondary' }}>End Date:</span>
                    <span>{dayjs(event.endTime).format('DD/MM/YYYY HH:mm')}</span>
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                    <span style={{ fontWeight: 'bold', color: 'text.secondary' }}>Location:</span>
                    <span>{event.location}</span>
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                    <span style={{ fontWeight: 'bold', color: 'text.secondary' }}>Capacity:</span>
                    <span>{event.capacity}</span>
                  </Typography>

                  <SeeDetails
                    details={{
                      Description: event.description || 'No description available',
                      Created: dayjs(event.createdAt).format('DD/MM/YYYY HH:mm'),
                      Updated: dayjs(event.updatedAt).format('DD/MM/YYYY HH:mm'),
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">{t('event:no_events_found')}</Typography>
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

export default MyEvents;
