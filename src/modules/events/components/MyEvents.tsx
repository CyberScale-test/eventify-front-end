import useAuth from '@modules/auth/hooks/api/useAuth';
import useEventsCreated from '@modules/events/hooks/useEventsCreated';
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

const MyEvents = () => {
  const { user } = useAuth();
  const { events, paginationMeta, loading, error, setCurrentPage } = useEventsCreated(user?.id);

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
                    {dayjs(event.start_time).format('DD/MM/YYYY HH:mm')} -{' '}
                    {dayjs(event.end_time).format('DD/MM/YYYY HH:mm')}
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
            <Typography>No events found.</Typography>
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

export default MyEvents;
