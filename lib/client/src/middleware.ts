import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { sessionOptions } from 'utils/session/config';

import { getMiddlewareSession } from 'utils/session/edge';

const PUBLIC_FILE = /\.(.*)$/;

const redirectToSignIn = (request: NextRequest, response: NextResponse) => {
  const requestUrl = request.headers.get('referer');
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();

  const isSign = pathname.startsWith('/sign-in');

  if (isSign) {
    return response;
  }

  url.pathname = `/sign-in`;
  if (requestUrl) {
    url.searchParams.set('callbackUrl', requestUrl);
  }

  return NextResponse.redirect(new URL(url, request.url));
};

export async function middleware(request: NextRequest) {
  console.log('Middleware triggered for:', request.nextUrl.pathname);
  const response = NextResponse.next();

  return response;

  // const pathname = request.nextUrl.pathname;

  // const isAuth = pathname.startsWith('/auth');

  // if (
  //   pathname.startsWith('/_next') ||
  //   pathname.startsWith('/api') ||
  //   pathname.startsWith('/static') ||
  //   pathname.includes('.') ||
  //   PUBLIC_FILE.test(pathname)
  // ) {
  //   return response;
  // }

  // const url = request.nextUrl.clone();
  // const requestUrl = request.headers.get('referer');

  // const session = await getMiddlewareSession(request, response);
  // if (!session) {
  //   return redirectToSignIn(request, response);
  // }

  // const user = await fetch(`${process.env.APP_URL_INTERNAL}/api/session/user`, {
  //   headers: { cookie: request.headers.get('cookie') || '' }
  // })
  //   .then((res) => res.json())
  //   .catch((err) => {
  //     console.log(`${process.env.APP_URL_INTERNAL}/api/session/user`, err);
  //     return undefined;
  //   });

  // if (!user) {
  //   const res = redirectToSignIn(request, response);
  //   res.cookies.set(sessionOptions.cookieName, '', {
  //     expires: new Date(1998, 1, 1)
  //   });
  //   return res;
  // }

  // if (user.change_password) {
  //   if (pathname.startsWith('/auth/change-password')) {
  //     return response;
  //   }

  //   url.pathname = '/auth/change-password';

  //   if (requestUrl) {
  //     url.searchParams.set('callbackUrl', requestUrl);
  //   }
  //   return NextResponse.redirect(new URL(url, request.url));
  // }

  // if (!isAuth) {
  //   url.pathname = '/auth';
  //   url.searchParams.delete('callbackUrl');
  //   return NextResponse.redirect(new URL(url, request.url));
  // }

  // if (pathname.startsWith('/auth/change-password')) {
  //   const callbackUrl = url.searchParams.get('callbackUrl');
  //   url.pathname = callbackUrl || '/auth';
  //   url.searchParams.delete('callbackUrl');

  //   return NextResponse.redirect(new URL(url, request.url));
  // }

  // return response;
}

export const config = { matcher: '/:path*' };
