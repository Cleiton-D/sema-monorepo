import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListAccessLevelsService from '@modules/authorization/services/ListAccessLevelsService';
import CreateAccessLevelService from '@modules/authorization/services/CreateAccessLevelService';
import DeleteAccessLevelService from '@modules/authorization/services/DeleteAccessLevelService';

class AccessLevelController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listAccessLevels = container.resolve(ListAccessLevelsService);
    const accessLevel = await listAccessLevels.execute();

    return response.json(accessLevel);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { description, code, only_on } = request.body;

    const createAccessLevel = container.resolve(CreateAccessLevelService);

    const accessLevel = await createAccessLevel.execute({
      description,
      code,
      only_on,
    });

    return response.json(accessLevel);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { access_level_id } = request.params;

    const deleteAccessLevel = container.resolve(DeleteAccessLevelService);
    await deleteAccessLevel.execute({ access_level_id });

    return response.status(204).send();
  }
}

export default AccessLevelController;
