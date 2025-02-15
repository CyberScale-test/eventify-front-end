import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import PageHeader from '@common/components/lib/partials/PageHeader';
import MyBookings from '@modules/events/components/MyBookings';

const MyBookingsPage: NextPage = () => {
  const { t } = useTranslation(['event', 'common']);

  return (
    <>
      <PageHeader title={t('event:my_bookings_title')} />
      <MyBookings />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'event', 'common'])),
  },
});

export default withAuth(MyBookingsPage, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: '/auth/login',
});
