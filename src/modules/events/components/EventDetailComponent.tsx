import React from 'react';
import { Typography, Card, CardContent, Grid, Button } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Event } from '@modules/events/defs/types';

interface EventDetailComponentProps {
  event: Event;
}

const EventDetailComponent: React.FC<EventDetailComponentProps> = ({ event }) => {
  const { t } = useTranslation(['event', 'common']);

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 5, p: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h2" align="center" gutterBottom>
              {event.title}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {t('event:start_time')}
            </Typography>
            <Typography variant="body1">
              {dayjs(event.startTime).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {t('event:end_time')}
            </Typography>
            <Typography variant="body1">
              {dayjs(event.endTime).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              {t('event:location')}
            </Typography>
            <Typography variant="body1">{event.location}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              {t('event:city')}
            </Typography>
            <Typography variant="body1">{event.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              {t('event:capacity')}
            </Typography>
            <Typography variant="body1">{event.capacity}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              {t('event:description')}
            </Typography>
            <Typography variant="body1">{event.description}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EventDetailComponent;
