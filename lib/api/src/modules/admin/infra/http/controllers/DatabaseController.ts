import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateDatabaseDumpService from '@modules/admin/services/CreateDatabaseDumpService';

class DatabaseController {
  public async dump(_request: Request, response: Response): Promise<Response> {
    const createDatabaseDump = container.resolve(CreateDatabaseDumpService);
    const result = await createDatabaseDump.execute();

    return response.json(result);
  }
}

export default DatabaseController;
