import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import PageHeader from '@common/components/lib/partials/PageHeader';
import MyEvents from '@modules/events/components/MyEvents';

const MyEventsPage: NextPage = () => {
  const { t } = useTranslation(['event', 'common']);

  return (
    <>
      <PageHeader title={t('event:my_events_title')} />
      <MyEvents />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'event', 'common'])),
  },
});

export default withAuth(MyEventsPage, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: '/auth/login',
});
