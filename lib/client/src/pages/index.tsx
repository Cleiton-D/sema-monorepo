import { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import protectedRoutes from 'utils/protected-routes';
import { useSession } from 'requests/queries/session';

export default function AppIndex() {
  const { push } = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.token) {
      push('/auth');
    } else {
      push('/sign-in');
    }
  }, [session, push]);

  return <></>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return { props: { session } };
}
