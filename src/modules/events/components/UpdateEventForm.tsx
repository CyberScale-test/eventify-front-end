import { RHFTextField, RHFDatePicker, RHFSelect } from '@common/components/lib/react-hook-form';
import UpdateCrudItemForm from '@common/components/partials/UpdateCrudItemForm';
import Routes from '@common/defs/routes';
import useEvents, { UpdateOneInput } from '@modules/events/hooks/api/useEvents';
import { Event } from '@modules/events/defs/types';
import { Grid, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { useDataContext } from '@common/contexts/DataContext';

interface UpdateEventFormProps {
  item: Event;
}

const UpdateEventForm = (props: UpdateEventFormProps) => {
  const { item } = props;
  const { t } = useTranslation(['event']);
  const { data } = useDataContext();
  const cities = data?.cities || [];

  // Log the item and cities for debugging
  console.log('Item:', item);
  console.log('Cities:', cities);

  // Validation schema
  const schema = Yup.object().shape({
    title: Yup.string().required(t('event:field_required')),
    startTime: Yup.date().required(t('event:field_required')),
    endTime: Yup.date().required(t('event:field_required')),
    location: Yup.string().required(t('event:field_required')),
    capacity: Yup.number().required(t('event:field_required')).positive().integer(),
    cityId: Yup.number().required(t('event:field_required')).nullable(),
    description: Yup.string().nullable(),
  });

  // Default values for the form
  const defaultValues: UpdateOneInput = {
    title: item.title,
    description: item.description,
    startTime: dayjs(item.startTime),
    endTime: dayjs(item.endTime),
    location: item.location || '',
    capacity: item.capacity,
    cityId: item.cityId,
  };

  // delete me later
  console.log('Default Values:', defaultValues);

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
          <RHFTextField name="description" label={t('event:description')} />
        </Grid>
        <Grid item xs={6}>
          <RHFDatePicker name="startTime" label={t('event:start_time')} />
        </Grid>
        <Grid item xs={6}>
          <RHFDatePicker name="endTime" label={t('event:end_time')} />
        </Grid>
        <Grid item xs={12}>
          <RHFTextField name="location" label={t('event:location')} />
        </Grid>
        <Grid item xs={6}>
          <RHFTextField name="capacity" label={t('event:capacity')} type="number" />
        </Grid>
        <Grid item xs={6}>
          <RHFSelect name="cityId" label={t('event:city')}>
            <MenuItem value="">{t('event:select_city')}</MenuItem>
            {cities.map((city) => (
              <MenuItem key={city.id} value={city.id}>
                {city.name}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
      </Grid>
    </UpdateCrudItemForm>
  );
};

export default UpdateEventForm;
