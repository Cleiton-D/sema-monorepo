import { NextRequest, NextResponse } from 'next/server';

import { getMiddlewareSession } from 'utils/getMiddlewareSession';

export async function middleware(request: NextRequest) {
  if (request.url === '/' && request.method === 'GET') {
    const session = await getMiddlewareSession(request);
    const url = request.nextUrl.clone();

    if (session) {
      url.pathname = '/auth';
      return NextResponse.redirect(url, 302);
    } else {
      url.pathname = '/sign-in';
      return NextResponse.redirect('/sign-in', 302);
    }
  }

  return NextResponse.next();
}
