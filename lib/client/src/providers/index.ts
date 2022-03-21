import CredentialsProvider, {
  CredentialsProvider as CredentialsProviderProps
} from 'next-auth/providers/credentials';

// import Providers, { CredentialsProvider } from 'next-auth/providers';

const Refresh: CredentialsProviderProps = (options) => ({
  id: 'refresh',
  name: 'Refresh',
  type: 'credentials',
  authorize: () => null,

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  credentials: () => null,
  ...options
});

const Credentials = CredentialsProvider;

export { Credentials, Refresh };
