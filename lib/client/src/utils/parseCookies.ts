import cookie from 'cookie';
import Cookies from 'cookies';
import { GetServerSidePropsContext } from 'next';

export function parseCookies(context: GetServerSidePropsContext) {
  const request = context.req;

  return cookie.parse(request ? request.headers.cookie || '' : document.cookie);
}

export function setCookies(
  context: GetServerSidePropsContext,
  key: string,
  value: string
) {
  const { req, res } = context;

  const cookies = new Cookies(req, res);
  cookies.set(key, value, {
    httpOnly: false
  });
}
