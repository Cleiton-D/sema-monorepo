import Providers, { CredentialsProvider } from 'next-auth/providers';

const Refresh: CredentialsProvider = (options) => ({
  id: 'refresh',
  name: 'Refresh',
  type: 'credentials',
  authorize: () => null,
  credentials: () => null,
  ...options
});

const Credentials = Providers.Credentials;

export { Credentials, Refresh };
