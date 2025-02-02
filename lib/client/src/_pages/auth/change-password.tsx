import { GetServerSidePropsContext } from 'next';
// import ChangePassword, { ChangePasswordProps } from 'templates/ChangePassword';

import { SystemBackground } from 'models/SystemBackground';

import { createUnstableApi } from 'services/api';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

export default function ChangePasswordPage(props: any) {
  return <>teste</>;

  // return <ChangePassword {...props} />;
}

export const getServerSideProps = withProtectedRoute<{
  background?: SystemBackground;
}>(async (context: GetServerSidePropsContext) => {
  try {
    const api = createUnstableApi(context.req.session);

    const { data: background } = await api.get<SystemBackground>(
      `/admin/background/current`
    );

    return {
      props: { background }
    };
  } catch (err) {
    return {
      props: {}
    };
  }
});
