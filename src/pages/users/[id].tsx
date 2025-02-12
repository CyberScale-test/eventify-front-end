import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useProgressBar from '@common/hooks/useProgressBar';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import UpdateUserForm from '@modules/users/components/partials/UpdateUserForm';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Routes from '@common/defs/routes';
import { User } from '@modules/users/defs/types';
import useUsers from '@modules/users/hooks/api/useUsers';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '@common/components/lib/feedbacks/LoadingScreen';

const UserDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { start, stop } = useProgressBar();
  const { readOne } = useUsers();
  const [item, setItem] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation(['user', 'common']);

  // Fetch user data when `id` changes
  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        const userId = Number(id); // Convert id to a number
        const { data } = await readOne(userId); // Fetch user by ID
        if (data && data.item) {
          setItem(data.item); // Set the fetched user to state
        }
        setLoaded(true); // Mark as loaded
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (!loaded) {
      start();
    } else {
      stop();
    }
  }, [loaded]);

  // Render loading screen if data is not yet loaded
  if (!loaded) {
    return <LoadingScreen />;
  }

  if (!item) {
    return <div>{t('common:user_not_found')}</div>;
  }

  return (
    <>
      <PageHeader title={t('user:update_user')} />

      <CustomBreadcrumbs
        links={[
          { name: t('common:home'), href: Routes.Common.Home },
          { name: t('common:users'), href: Routes.Users.ReadAll },
          { name: t('user:update_user') },
        ]}
      />

      <UpdateUserForm item={item} />
    </>
  );
};

export const getStaticPaths = () => {
  return { paths: [], fallback: 'blocking' }; // Dynamic routes handled at runtime
};

// Server-side translations for i18n (study more this topic)
export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'user', 'common'])),
  },
});

// Wrap the page with authentication and permission checks
export default withAuth(
  withPermissions(UserDetailPage, {
    requiredPermissions: {
      entity: Namespaces.Users,
      action: CRUD_ACTION.UPDATE,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
