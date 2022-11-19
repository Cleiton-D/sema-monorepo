import type { NextApiRequest } from 'next';
import type { Browser } from 'puppeteer';

import cookie from 'cookie';

export const getPuppeteerPage = async (
  request: NextApiRequest,
  browser: Browser
) => {
  const page = await browser.newPage();

  const cookies = request.cookies;

  const serializedCookies = Object.entries(cookies)
    .filter(([key, value]) => {
      if (!key.startsWith('next-auth')) return false;
      if (!value) return false;

      return true;
    })
    .map(([key, value]) => cookie.serialize(key, value!))
    .join('; ');

  await page.setExtraHTTPHeaders({ cookie: serializedCookies });

  return page;
};
