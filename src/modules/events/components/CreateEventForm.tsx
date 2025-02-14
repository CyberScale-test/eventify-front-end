import { RHFTextField, RHFDatePicker, RHFSelect } from '@common/components/lib/react-hook-form';
import CreateCrudItemForm from '@common/components/partials/CreateCrudItemForm';
import Routes from '@common/defs/routes';
import useEvents, { CreateOneInput } from '@modules/events/hooks/api/useEvents';
import { ItemResponse } from '@common/hooks/useItems';
import { Event } from '@modules/events/defs/types';
import { Grid, MenuItem } from '@mui/material';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { UseFormReturn } from 'react-hook-form';
import { useDataContext } from '@common/contexts/DataContext';
import dayjs from 'dayjs';

const CreateEventForm = () => {
  const router = useRouter();
  const { data } = useDataContext();
  const cities = data?.cities || [];

  // validation schema
  const schema = Yup.object().shape({
    title: Yup.string().required('Le champ est obligatoire'),
    start_time: Yup.date().required('Le champ est obligatoire'),
    end_time: Yup.date().required('Le champ est obligatoire'),
    location: Yup.string().required('Le champ est obligatoire'),
    capacity: Yup.number().required('Le champ capacité est obligatoire').positive().integer(),
    city_id: Yup.number().required('select a city').nullable(),
  });

  const defaultValues: CreateOneInput = {
    title: '',
    description: '',
    start_time: dayjs(),
    end_time: dayjs(),
    location: '',
    capacity: 1,
    city_id: null,
  };

  const onPostSubmit = async (
    _data: CreateOneInput,
    response: ItemResponse<Event>,
    _methods: UseFormReturn<CreateOneInput>
  ) => {
    if (response.success) {
      console.log('Api response', response);
      console.log('Request', _data);
      router.push(Routes.Events.ReadAll);
    }
  };

  return (
    <CreateCrudItemForm<Event, CreateOneInput>
      routes={Routes.Events}
      useItems={useEvents}
      schema={schema}
      defaultValues={defaultValues}
      onPostSubmit={onPostSubmit}
    >
      <Grid container spacing={3} sx={{ padding: 6 }}>
        <Grid item xs={12}>
          <RHFTextField name="title" label="Titre" />
        </Grid>
        <Grid item xs={12}>
          <RHFTextField name="description" label="Description" />
        </Grid>
        <Grid item xs={6}>
          <RHFDatePicker name="start_time" label="Start Time" />
        </Grid>
        <Grid item xs={6}>
          <RHFDatePicker name="end_time" label="End Time" />
        </Grid>
        <Grid item xs={12}>
          <RHFTextField name="location" label="Location" />
        </Grid>
        <Grid item xs={6}>
          <RHFTextField name="capacity" label="Maximum Participants" type="number" />
        </Grid>
        <Grid item xs={6}>
          <RHFSelect name="city_id" label="City">
            <MenuItem value="">Select a city please!</MenuItem>
            {cities.map((city) => (
              <MenuItem key={city.id} value={city.id}>
                {city.name}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
      </Grid>
    </CreateCrudItemForm>
  );
};

export default CreateEventForm;
