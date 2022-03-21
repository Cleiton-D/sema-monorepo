import { NextRequest, NextResponse } from 'next/server';
import { getMiddlewareSession } from 'utils/getMiddlewareSession';

export async function middleware(request: NextRequest) {
  const session = await getMiddlewareSession(request);

  const url = request.nextUrl.clone();
  if (!session) {
    url.pathname = '/sign-in';
    return NextResponse.redirect(url, 302);
  }

  if (session?.changePassword) {
    if (request.page.name !== '/auth/change-password') {
      const location = `/auth/change-password?callbackUrl=${request.url}`;

      url.pathname = location;
      return NextResponse.redirect(url, 302);
    }
  }

  return NextResponse.next();
}
