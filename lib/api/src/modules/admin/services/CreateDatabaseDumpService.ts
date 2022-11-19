import { injectable } from 'tsyringe';
import shell from 'shelljs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs, { ReadStream } from 'fs';

import storageConfig from '@config/storage';

type CreateDatabaseDumpResponse = {
  filename: string;
  stream: ReadStream;
};

@injectable()
class CreateDatabaseDumpService {
  public async execute(): Promise<CreateDatabaseDumpResponse> {
    const username = process.env.POSTGRES_USERNAME;
    const pass = process.env.POSTGRES_PASSWORD;
    const database = process.env.POSTGRES_DATABASE;
    const host = process.env.POSTGRES_HOST;
    const port = process.env.POSTGRES_PORT;

    const fileDir = path.join(
      storageConfig.storagePath,
      `/temp/database-backup-${uuidv4()}.sql`,
    );

    const scriptFileDir = fileDir.replace(/(\s+)/g, '\\$1');
    shell.exec(
      `PGPASSWORD="${pass}" pg_dumpall -U ${username} -h ${host} -p ${port} -l ${database} -f ${scriptFileDir} -O --column-inserts
      `,
    );

    const now = new Date();
    const currentDate = `${now.getFullYear()}.${
      now.getMonth() + 1
    }.${now.getDate()}.${now.getHours()}.${now.getMinutes()}`;

    const filename = `database-backup-${currentDate}.sql`;

    const readStream = fs.createReadStream(fileDir);
    readStream.on('end', () => {
      fs.promises.unlink(fileDir);
    });

    return { filename, stream: readStream };
  }
}

export default CreateDatabaseDumpService;
