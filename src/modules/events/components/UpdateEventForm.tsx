import { RHFTextField, RHFDatePicker } from '@common/components/lib/react-hook-form';
import UpdateCrudItemForm from '@common/components/partials/UpdateCrudItemForm';
import Routes from '@common/defs/routes';
import useEvents, { UpdateOneInput } from '@modules/events/hooks/api/useEvents';
import { Event } from '@modules/events/defs/types';
import { Grid } from '@mui/material';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

interface UpdateEventFormProps {
  item: Event;
}

const UpdateEventForm = (props: UpdateEventFormProps) => {
  const { item } = props;
  const { t } = useTranslation(['event']);
  const schema = Yup.object().shape({
    title: Yup.string().required(t('event:field_required')),
    date: Yup.date().required(t('event:field_required')),
    location: Yup.string().required(t('event:field_required')),
  });

  const defaultValues: UpdateOneInput = {
    title: item.title,
    date: item.date,
    location: item.location,
    max: 0,
  };

  return (
    <UpdateCrudItemForm<Event, UpdateOneInput>
      item={item}
      routes={Routes.Events}
      useItems={useEvents}
      schema={schema}
      defaultValues={defaultValues}
    >
      <Grid container spacing={3} sx={{ padding: 6 }}>
        <Grid item xs={12}>
          <RHFTextField name="title" label={t('event:title')} />
        </Grid>
        <Grid item xs={12}>
          <RHFDatePicker name="date" label={t('event:date')} />
        </Grid>
        <Grid item xs={12}>
          <RHFTextField name="location" label={t('event:location')} />
        </Grid>
      </Grid>
    </UpdateCrudItemForm>
  );
};

export default UpdateEventForm;
