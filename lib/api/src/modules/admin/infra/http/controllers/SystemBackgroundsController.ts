import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import CreateSystemBackgroundService from '@modules/admin/services/CreateSystemBackgroundService';
import ShowCurrentSystemBackgroundService from '@modules/admin/services/ShowCurrentSystemBackgroundService';
import ListSystemBackgroundsService from '@modules/admin/services/ListSystemBackgroundsService';
import DefineCurrentSystemBackgroundService from '@modules/admin/services/DefineCurrentSystemBackgroundService';
import DeleteSystemBackgroundService from '@modules/admin/services/DeleteSystemBackgroundService';

class SystemBackgroundsController {
  public async index(_request: Request, response: Response): Promise<Response> {
    const listSystemBackgrounds = container.resolve(
      ListSystemBackgroundsService,
    );

    const systemBackgrounds = await listSystemBackgrounds.execute();
    return response.json(instanceToInstance(systemBackgrounds));
  }

  public async current(
    _request: Request,
    response: Response,
  ): Promise<Response> {
    const showCurrentSystemBackground = container.resolve(
      ShowCurrentSystemBackgroundService,
    );

    const systemBackground = await showCurrentSystemBackground.execute();
    return response.json(instanceToInstance(systemBackground));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const [file] = request.files as Express.Multer.File[];

    const createSystemBackground = container.resolve(
      CreateSystemBackgroundService,
    );

    const systemBackground = await createSystemBackground.execute({
      filename: file.filename,
    });

    return response.json(instanceToInstance(systemBackground));
  }

  public async changeCurrent(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { system_background_id, is_defined } = request.body;

    const defineCurrentSystemBackground = container.resolve(
      DefineCurrentSystemBackgroundService,
    );

    const systemBackground = await defineCurrentSystemBackground.execute({
      system_background_id,
      is_defined,
    });
    return response.json(instanceToInstance(systemBackground));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { system_background_id } = request.params;

    const deleteSystemBackground = container.resolve(
      DeleteSystemBackgroundService,
    );

    await deleteSystemBackground.execute({
      system_background_id,
    });

    return response.status(204).send();
  }
}

export default SystemBackgroundsController;
