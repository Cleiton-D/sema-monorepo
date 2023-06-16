import { DehydratedState, Hydrate } from 'react-query';

export type DehydratedSession = DehydratedState;

type SessionProviderProps = {
  children: React.ReactNode;
  session: DehydratedSession;
};

export const SessionProvider = ({
  children,
  session
}: SessionProviderProps) => {
  return <Hydrate state={session}>{children}</Hydrate>;
};
