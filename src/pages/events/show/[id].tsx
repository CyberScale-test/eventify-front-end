import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useProgressBar from '@common/hooks/useProgressBar';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import EventDetailComponent from '@modules/events/components/EventDetailComponent';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Routes from '@common/defs/routes';
import { Event } from '@modules/events/defs/types';
import useEvents from '@modules/events/hooks/api/useEvents';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '@common/components/lib/feedbacks/LoadingScreen';
import NotFound from '@common/components/pages/NotFound';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';

const EventDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { start, stop } = useProgressBar();
  const { readOne } = useEvents();
  const [event, setEvent] = useState<Event | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation(['event', 'common']);

  useEffect(() => {
    const fetchEvent = async () => {
      if (id) {
        const eventId = Number(id);
        const { data } = await readOne(eventId);
        if (data && data.item) {
          setEvent(data.item);
        }
        setLoaded(true);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!loaded) {
      start();
    } else {
      stop();
    }
  }, [loaded]);

  if (!loaded) {
    return <LoadingScreen />;
  }

  if (!event) {
    return <NotFound />;
  }

  return (
    <>
      <CustomBreadcrumbs
        links={[
          { name: t('event:list.title'), href: Routes.Events.ReadAll },
          { name: event.title, href: '' },
        ]}
      />
      <PageHeader title={event.title} />
      <EventDetailComponent event={event} />
    </>
  );
};

export const getStaticPaths = () => {
  return { paths: [], fallback: 'blocking' }; // Dynamic routes handled at runtime
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'event', 'common'])),
  },
});

export default withAuth(
  withPermissions(EventDetailPage, {
    requiredPermissions: {
      entity: Namespaces.Events,
      action: CRUD_ACTION.READ,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
