import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const storagePath = path.resolve(__dirname, '..', '..', 'storage');

type UploadConfig = {
  tempFolder: string;
  storagePath: string;
  uploadsPath: string;

  multer: {
    storage: StorageEngine;
  };
};

export default {
  storagePath,
  uploadsPath: path.join(storagePath, 'upload'),
  tempFolder: path.join(storagePath, 'temp'),

  multer: {
    storage: multer.diskStorage({
      destination: path.join(storagePath, 'temp'),
      filename(_, file, callback) {
        const hash = crypto.randomBytes(10).toString('hex');
        const filename = `${hash}-${file.originalname}`;
        return callback(null, filename);
      },
    }),
  },
} as UploadConfig;
