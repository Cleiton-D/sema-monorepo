import { GetStaticProps } from 'next';

import SignIn, { SignInProps } from 'templates/SignIn';

import { SystemBackground } from 'models/SystemBackground';

import { initializeApi } from 'services/api';

export default function SignInPage(props: SignInProps) {
  return <SignIn {...props} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const api = initializeApi();

  try {
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
};
