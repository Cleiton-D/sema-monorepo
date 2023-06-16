import { getIronSession } from 'iron-session/edge';
import { NextRequest, NextResponse } from 'next/server';

import { sessionOptions } from './config';

export const getMiddlewareSession = async (
  request: NextRequest,
  response: NextResponse
) => {
  const session = await getIronSession(request, response, sessionOptions);
  if (!session.token) return undefined;

  return session;
};
