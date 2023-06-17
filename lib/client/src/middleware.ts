import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

import { getMiddlewareSession } from 'utils/session/edge';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

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
    return response;
  }

  const url = request.nextUrl.clone();
  const requestUrl = request.headers.get('referer');

  const session = await getMiddlewareSession(request, response);
  if (!session) {
    if (isSign) {
      return response;
    }

    url.pathname = `/sign-in`;
    if (requestUrl) {
      url.searchParams.set('callbackUrl', requestUrl);
    }
    return NextResponse.redirect(new URL(url, request.url));
  }

  const user = await fetch(`${process.env.APP_URL_INTERNAL}/api/session/user`, {
    headers: { cookie: request.headers.get('cookie') || '' }
  })
    .then((res) => res.json())
    .catch(() => undefined);

  if (user.change_password) {
    if (pathname.startsWith('/auth/change-password')) {
      return response;
    }

    url.pathname = '/auth/change-password';

    if (requestUrl) {
      url.searchParams.set('callbackUrl', requestUrl);
    }
    return NextResponse.redirect(new URL(url, request.url));
  }

  if (!isAuth) {
    url.pathname = '/auth';
    url.searchParams.delete('callbackUrl');
    return NextResponse.redirect(new URL(url, request.url));
  }

  if (pathname.startsWith('/auth/change-password')) {
    const callbackUrl = url.searchParams.get('callbackUrl');
    url.pathname = callbackUrl || '/auth';
    url.searchParams.delete('callbackUrl');

    return NextResponse.redirect(new URL(url, request.url));
  }

  return response;
}

export const config = { matcher: '/:path*' };
