import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${process.env.APP_URL}/reports/teste`);
  // const buff = await page.pdf({ format: 'a4' });

  const buff = await page.pdf({ format: 'a4' });

  return response.end(buff);
};
