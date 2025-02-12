import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useProgressBar from '@common/hooks/useProgressBar';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import UpdateEventForm from '@modules/events/components/UpdateEventForm';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Routes from '@common/defs/routes';
import { Event } from '@modules/events/defs/types';
import useEvents from '@modules/events/hooks/api/useEvents';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '@common/components/lib/feedbacks/LoadingScreen';

const EventDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { start, stop } = useProgressBar();
  const { readOne } = useEvents();
  const [item, setItem] = useState<Event | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation(['event', 'common']);

  useEffect(() => {
    const fetchEvent = async () => {
      if (id) {
        const eventId = Number(id);
        const { data } = await readOne(eventId);
        if (data && data.item) {
          setItem(data.item);
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

  // Render loading screen if data is not yet loaded I don't it'll work
  if (!loaded) {
    return <LoadingScreen />;
  }

  if (!item) {
    return <div>{t('common:event_not_found')}</div>;
  }

  return (
    <>
      <PageHeader title={t('event:update_event')} />
      <CustomBreadcrumbs
        links={[
          { name: t('common:home'), href: Routes.Common.Home },
          { name: t('common:events'), href: Routes.Events.ReadAll },
          { name: t('event:update_event') },
        ]}
      />
      <UpdateEventForm item={item} />
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
      action: CRUD_ACTION.UPDATE,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
