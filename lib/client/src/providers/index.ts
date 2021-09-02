import Providers, { CredentialsProvider } from 'next-auth/providers';

const Refresh: CredentialsProvider = (options) => ({
  id: 'refresh',
  name: 'Refresh',
  type: 'credentials',
  authorize: () => null,

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  credentials: () => null,
  ...options
});

const Credentials = Providers.Credentials;

export { Credentials, Refresh };
