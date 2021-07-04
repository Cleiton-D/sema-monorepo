import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/client';

import SignIn from 'templates/SignIn';

export default function SignInPage() {
  return <SignIn />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (session) {
    const location = context.query.callbackUrl || '/';

    context.res.writeHead(302, { Location: location });
    context.res.end();
  }

  return { props: {} };
}
