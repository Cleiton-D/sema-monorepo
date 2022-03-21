import { NextRequest, NextResponse } from 'next/server';

import { getMiddlewareSession } from 'utils/getMiddlewareSession';

export async function middleware(request: NextRequest) {
  const session = await getMiddlewareSession(request);

  if (session) {
    const location = request.nextUrl.searchParams.get('callbackUrl') || '/';
    const url = request.nextUrl.clone();
    url.pathname = location;
    return NextResponse.redirect(url, 302);
  }

  return NextResponse.next();
}
