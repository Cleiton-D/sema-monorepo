import fs from 'fs';
import path from 'path';

import uploadConfig from '@config/storage';

import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.copyFile(
      path.join(uploadConfig.tempFolder, file),
      path.join(uploadConfig.uploadsPath, file),
    );

    await fs.promises.unlink(path.join(uploadConfig.tempFolder, file));

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.join(uploadConfig.uploadsPath, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;
