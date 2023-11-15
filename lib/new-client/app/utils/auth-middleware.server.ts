import { redirect } from "@remix-run/node";

import { authCookie, getIronSession, getUser } from "~/utils/session.server";

async function redirectToSignIn(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const isSign = pathname.startsWith("/sign-in");

  if (isSign) {
    return null;
  }
  
  url.pathname = "/sign-in";
  url.searchParams.set("callbackUrl", request.url);
  
  throw redirect(url.toString(), {
    status: 302,
    headers: {
      "Set-Cookie": await authCookie.serialize(""),
    },
  });
}

export async function authLoader(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const isAuth =
    pathname.startsWith("/auth") || pathname.startsWith("/legacy/auth");

  const session = await getIronSession(request);
  if (!session?.token) {
    return redirectToSignIn(request);
  }

  const user = await getUser(request, session.token).catch(() => undefined);
  if (!user) {
    return redirectToSignIn(request);
  }

  if (user.change_password) {
    if (pathname.startsWith("/auth/change-password")) {
      return null;
    }

    url.pathname = "/auth/change-password";

    if (request.url) {
      url.searchParams.set("callbackUrl", request.url);
    }
    throw redirect(url.toString(), 302);
  }

  if (!isAuth) {
    url.pathname = "/auth";
    url.searchParams.delete("callbackUrl");
    throw redirect(url.toString(), 302);
  }

  if (
    pathname.startsWith("/auth/change-password") ||
    pathname.startsWith("/legacy/auth/change-password")
  ) {
    const callbackUrl = url.searchParams.get("callbackUrl");
    url.pathname = callbackUrl || "/auth";
    url.searchParams.delete("callbackUrl");

    throw redirect(url.toString(), 302);
  }

  return user;
}
