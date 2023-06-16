import { IronSessionData, unsealData } from 'iron-session';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
  NextApiRequest
} from 'next';

import { sessionOptions } from './config';

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, sessionOptions);
}

export const getIronSession = async (req: NextApiRequest) => {
  const cookieValue = req.cookies[sessionOptions.cookieName];
  if (!cookieValue) return undefined;

  const session = await unsealData<IronSessionData>(cookieValue, {
    password: sessionOptions.password,
    ttl: sessionOptions.ttl
  });

  return session;
};
