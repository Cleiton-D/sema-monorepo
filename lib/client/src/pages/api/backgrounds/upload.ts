import { NextApiRequest, NextApiResponse } from 'next';

import nextConnect from 'next-connect';
import multer from 'multer';

import { uploadConfig } from 'config/upload';
import { initializeApi } from 'services/api';
import { SystemBackground } from 'models/SystemBackground';
import { encodeImageToBlurhash } from 'utils/encodeImageToBlurhash';

const upload = multer(uploadConfig);

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
});

apiRoute.use(upload.single('image'));

type FileUploadRequest = NextApiRequest & {
  file: Express.Multer.File;
};
apiRoute.post(async (req: FileUploadRequest, res) => {
  // const session = await getApiSession(req);
  // console.log(session);
  const file = req.file;
  // console.log(file.path);
  const blurhash = await encodeImageToBlurhash(file.path);
  console.log(blurhash);

  const api = initializeApi();

  const { data: systemBackground } = await api.post<SystemBackground>(
    `/admin/background`,
    {
      name: file.filename,
      blurhash
    }
  );

  await res.unstable_revalidate('/sign-in');

  return res.json(systemBackground);
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false
  }
};
