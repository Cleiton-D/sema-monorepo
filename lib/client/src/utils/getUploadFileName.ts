import path from 'path';
import fs from 'fs';

export const getFileName = (
  baseUrl: string,
  filename: string,
  index = 0
): string => {
  const extension = path.extname(filename);
  const regex = new RegExp(`(${extension})$`);
  const withoutExtension = filename.replace(regex, '');

  const newFilename =
    index > 0 ? `${withoutExtension} (${index})${extension}` : filename;

  const exists = fs.existsSync(path.join(baseUrl, newFilename));
  if (exists) {
    return getFileName(baseUrl, filename, index + 1);
  }

  return newFilename;
};
