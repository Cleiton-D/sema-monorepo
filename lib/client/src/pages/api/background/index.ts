import { NextApiRequest, NextApiResponse } from 'next';
import request from 'request';
import nextConnect from 'next-connect';

import { createUnstableApi } from 'services/api';
import { withSessionRoute } from 'utils/session/withSession';

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

apiRoute.post(async (nextRequest, nextResponse) => {
  const url = `${process.env.SERVER_API_URL}/admin/background`;

  const post = request.post(url, async (_err, _res, body) => {
    nextResponse.revalidate('/sign-in');
    return nextResponse.json(body);
  });

  nextRequest.pipe(post);
});

apiRoute.patch(async (nextRequest, nextResponse) => {
  nextRequest.on('data', async (data: Buffer) => {
    const { system_background_id, is_defined } = JSON.parse(data.toString());

    const url = `${process.env.SERVER_API_URL}/admin/background/current`;

    const api = createUnstableApi(nextRequest.session);
    const { data: systemBackground } = await api.patch(url, {
      system_background_id,
      is_defined
    });

    nextResponse.revalidate('/sign-in');

    return nextResponse.json(systemBackground);
  });
});

apiRoute.delete('/:teste', async (nextRequest, nextResponse) => {
  console.log(nextRequest.query);

  return nextResponse.json({ ok: true });
  // nextRequest.on('data', async (data: Buffer) => {
  //   const { system_background_id, is_defined } = JSON.parse(data.toString());

  //   const url = `${process.env.SERVER_API_URL}/admin/background/current`;

  //   const api = initializeApi();
  //   const { data: systemBackground } = await api.patch(url, {
  //     system_background_id,
  //     is_defined
  //   });

  //   nextResponse.unstable_revalidate('/sign-in');

  //   return nextResponse.json(systemBackground);
  // });
});

export default withSessionRoute(apiRoute);

export const config = {
  api: {
    bodyParser: false
  }
};
