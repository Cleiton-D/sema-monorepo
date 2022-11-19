import { GetServerSidePropsContext } from 'next';

import ChangePassword, { ChangePasswordProps } from 'templates/ChangePassword';

import { SystemBackground } from 'models/SystemBackground';

import { initializeApi } from 'services/api';
import protectedRoutes from 'utils/protected-routes';

export default function ChangePasswordPage(props: ChangePasswordProps) {
  return <ChangePassword {...props} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  try {
    const api = initializeApi(session);

    const { data: background } = await api.get<SystemBackground>(
      `/admin/background/current`
    );

    return {
      props: { background, session }
    };
  } catch (err) {
    return {
      props: { session }
    };
  }
}
