import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { initializeApi } from 'services/api';

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  attachParams: true,

  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
});

apiRoute.delete(async (nextRequest, nextResponse) => {
  const { systemBackgroundId } = nextRequest.query;

  const api = initializeApi();

  const url = `${process.env.SERVER_API_URL}/admin/background/${systemBackgroundId}`;
  await api.delete(url);

  nextResponse.revalidate('/sign-in');

  return nextResponse.status(204).end();
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false
  }
};
