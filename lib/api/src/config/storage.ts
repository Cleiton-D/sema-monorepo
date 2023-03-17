import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

// const storagePath = path.resolve(__dirname, '..', '..', 'storage');

const storagePath =
  process.env.STORAGE_PATH || path.resolve(__dirname, '..', '..', 'storage');

const uploadsPath = path.join(storagePath, 'upload');
const tempFolder = path.join(storagePath, 'temp');

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}
if (!fs.existsSync(tempFolder)) {
  fs.mkdirSync(tempFolder);
}

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
  uploadsPath,
  tempFolder,

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
