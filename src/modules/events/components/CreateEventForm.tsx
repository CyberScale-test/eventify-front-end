import { RHFTextField, RHFDatePicker } from '@common/components/lib/react-hook-form';
import CreateCrudItemForm from '@common/components/partials/CreateCrudItemForm';
import Routes from '@common/defs/routes';
import useEvents, { CreateOneInput } from '@modules/events/hooks/api/useEvents';
import { ItemResponse } from '@common/hooks/useItems';
import { Event } from '@modules/events/defs/types';
import { Grid } from '@mui/material';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { UseFormReturn } from 'react-hook-form';
import dayjs from 'dayjs';

const CreateEventForm = () => {
  const router = useRouter();
  const schema = Yup.object().shape({
    title: Yup.string().required('Le champ est obligatoire'),
    date: Yup.date().required('Le champ est obligatoire'),
    location: Yup.string().required('Le champ est obligatoire'),
  });

  const defaultValues: CreateOneInput = {
    title: '',
    date: dayjs(),
    location: '',
    max: 0,
    userId: 0,
  };

  const onPostSubmit = async (
    _data: CreateOneInput,
    response: ItemResponse<Event>,
    _methods: UseFormReturn<CreateOneInput>
  ) => {
    if (response.success) {
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
          <RHFDatePicker name="date" label="Date" />
        </Grid>
        <Grid item xs={12}>
          <RHFTextField name="location" label="Lieu" />
        </Grid>
      </Grid>
    </CreateCrudItemForm>
  );
};

export default CreateEventForm;
