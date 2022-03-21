import { injectable } from 'tsyringe';
import shell from 'shelljs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

import storageConfig from '@config/storage';

type CreateDatabaseDumpResponse = {
  filename: string;
  content: ArrayBufferLike;
};

@injectable()
class CreateDatabaseDumpService {
  public async execute(): Promise<CreateDatabaseDumpResponse> {
    const username = process.env.POSTGRES_USERNAME;
    const pass = process.env.POSTGRES_PASSWORD;
    const database = process.env.POSTGRES_DATABASE;
    const host = process.env.POSTGRES_HOST;
    const port = process.env.POSTGRES_PORT;

    const now = new Date();
    const currentDate = `${now.getFullYear()}.${
      now.getMonth() + 1
    }.${now.getDate()}.${now.getHours()}.${now.getMinutes()}`;

    const fileName = `database-backup-${currentDate}.sql`;

    const fileDir = path.join(
      storageConfig.storagePath,
      `/temp/database-backup-${uuidv4()}.sql`,
    );

    shell.exec(
      `PGPASSWORD="${pass}" pg_dumpall -U ${username} -h ${host} -p ${port} -l ${database} -f ${fileDir} -O --column-inserts
      `,
    );

    const file = fs.readFileSync(fileDir);
    await fs.promises.unlink(fileDir);

    return {
      filename: fileName,
      content: file,
    };
  }
}

export default CreateDatabaseDumpService;
