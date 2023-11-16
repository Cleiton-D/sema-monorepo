import type { DehydratedSession } from 'context/Session';
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult
} from 'next';

import { unstable__protectedRoutes } from 'utils/protected-routes';
import { withSessionSsr } from './withSession';

type PropsWithSession<P> = P & {
  session?: DehydratedSession;
};

export const withProtectedRoute = <
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler?: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
): GetServerSideProps<PropsWithSession<P>> => {
  return withSessionSsr(async (context) => {
    const session = await unstable__protectedRoutes(context);

    console.log("secao", session, context.req.url)
    if (!session) return {} as GetServerSidePropsResult<P>;
    const { dehydratedSession, fullSession } = session;
    context.req.fullSession = fullSession;

    if (!handler) {
      const props = { session: dehydratedSession } as unknown as P;
      return { props };
    }

    const result = await handler(context);
    const { props = {}, ...rest } = (result || {}) as {
      props: PropsWithSession<P>;
    };

    const propsWithSession = {
      ...props,
      session: dehydratedSession
    } as unknown as P;

    return { ...rest, props: propsWithSession };
  });
};
