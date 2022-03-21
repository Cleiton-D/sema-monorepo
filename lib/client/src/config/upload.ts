import multer from 'multer';
import path from 'path';
import { getFileName } from 'utils/getUploadFileName';

const baseUrl = path.join(process.cwd(), 'public', 'img', 'backgrounds');

export const uploadConfig = {
  storage: multer.diskStorage({
    destination: baseUrl,
    filename: (req, file, cb) => {
      const newFilename = getFileName(baseUrl, file.originalname);
      cb(null, newFilename);
    }
  })
};
