import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSystemBackgroundService from '@modules/admin/services/CreateSystemBackgroundService';
import ShowCurrentSystemBackgroundService from '@modules/admin/services/ShowCurrentSystemBackgroundService';

class SystemBackgroundsController {
  public async current(
    _request: Request,
    response: Response,
  ): Promise<Response> {
    const showCurrentSystemBackground = container.resolve(
      ShowCurrentSystemBackgroundService,
    );

    const systemBackground = await showCurrentSystemBackground.execute();
    return response.json(systemBackground);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, blurhash } = request.body;

    const createSystemBackground = container.resolve(
      CreateSystemBackgroundService,
    );

    const systemBackground = await createSystemBackground.execute({
      name,
      blurhash,
    });

    return response.json(systemBackground);
  }
}

export default SystemBackgroundsController;
