import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getMiddlewareSession } from 'utils/getMiddlewareSession';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isSign = pathname.startsWith('/sign-in');
  const isAuth = pathname.startsWith('/auth');

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const session = await getMiddlewareSession(request);

  const requestUrl = request.headers.get('referer');
  if (!session) {
    if (isSign) {
      return NextResponse.next();
    }

    url.pathname = `/sign-in`;
    if (requestUrl) {
      url.searchParams.set('callbackUrl', requestUrl);
    }
    return NextResponse.redirect(new URL(url, request.url));
  }

  if (session.changePassword) {
    if (pathname.startsWith('/auth/change-password')) {
      return NextResponse.next();
    }

    url.pathname = '/auth/change-password';

    if (requestUrl) {
      url.searchParams.set('callbackUrl', requestUrl);
    }
    return NextResponse.redirect(new URL(url, request.url));
  }

  if (!isAuth) {
    url.pathname = '/auth';
    return NextResponse.redirect(new URL(url, request.url));
  }

  return NextResponse.next();
}
