import { GetServerSidePropsContext } from 'next';

import prefetchQuery from './prefetch-query';

import { createUnstableApi } from 'services/api';

import { SESSION_KEYS } from 'requests/queries/session';

import { DehydratedSession } from 'context/Session';

type ServerSession = {
  dehydratedSession: DehydratedSession;
  fullSession: FullSession;
};

async function deprecated_protectedRoutes(context: GetServerSidePropsContext) {
  // const session = await getSession(context);
  // return session;
  return undefined;
}

export const unstable__protectedRoutes = async (
  context: GetServerSidePropsContext
): Promise<ServerSession | undefined> => {
  if (!context.req.session.token) return undefined;

  const api = createUnstableApi();
  api.defaults.headers = { cookie: context.req.headers.cookie };

  const [user, accessModules, profile, schoolYear] = await Promise.all([
    api
      .get(`${process.env.APP_URL_INTERNAL}/api/session/user`)
      .then((response) => response.data),
    api
      .get(`${process.env.APP_URL_INTERNAL}/api/session/access-modules`)
      .then((response) => response.data),
    api
      .get(`${process.env.APP_URL_INTERNAL}/api/session/profile`)
      .then((response) => response.data),
    api
      .get(`${process.env.APP_URL_INTERNAL}/api/session/school-year`)
      .then((response) => response.data)
  ]);

  const dehydratedSession = await prefetchQuery([
    {
      key: [SESSION_KEYS.all],
      fetcher: () => context.req.session
    },
    {
      key: [...SESSION_KEYS.user()],
      fetcher: () => user
    },
    {
      key: [...SESSION_KEYS.accessModules()],
      fetcher: () => accessModules
    },
    {
      key: [...SESSION_KEYS.profile()],
      fetcher: () => profile
    },
    {
      key: [...SESSION_KEYS.schoolYear()],
      fetcher: () => schoolYear
    }
  ]);

  const fullSession = { user, accessModules, profile, schoolYear };

  return { dehydratedSession, fullSession };
};

export default deprecated_protectedRoutes;
