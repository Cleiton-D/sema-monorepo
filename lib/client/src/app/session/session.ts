'use server';

import { IronSessionData, sealData, unsealData } from 'iron-session';
import { cookies } from 'next/headers';

const sessionOptions = {
  password: '5a0R8GsYz@!RblV4bRLQ1a1*Xpz^3OTL',
  cookieName: 'sema.3WGc5Lm3l9m',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  secure: process.env.NODE_ENV === 'production',
  ttl: 1200000,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production'
  }
};

export async function getIronSession(): Promise<IronSessionData | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(sessionOptions.cookieName);
  if (!cookieValue) return null;

  return unsealData(cookieValue.value, sessionOptions);
}

export async function createUserSession(token: string) {
  const session = (await getIronSession()) || {};
  session.token = token;

  const sessionCookie = await sealData(session, sessionOptions);

  return {
    sessionCookie,
    cookieName: sessionOptions.cookieName,
    ttl: sessionOptions.ttl
  };
}
