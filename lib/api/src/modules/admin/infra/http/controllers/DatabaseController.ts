import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateDatabaseDumpService from '@modules/admin/services/CreateDatabaseDumpService';

class DatabaseController {
  public async dump(_request: Request, response: Response): Promise<Response> {
    const createDatabaseDump = container.resolve(CreateDatabaseDumpService);
    const { filename, stream } = await createDatabaseDump.execute();

    response.setHeader('Content-Type', 'application/octet-stream');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${filename}`,
    );

    stream.pipe(response);
    return response;
  }
}

export default DatabaseController;
