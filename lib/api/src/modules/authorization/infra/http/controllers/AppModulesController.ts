import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppModuleService from '@modules/authorization/services/CreateAppModuleService';
import ListAppModulesService from '@modules/authorization/services/ListAppModulesService';

class AppModulesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listAppModules = container.resolve(ListAppModulesService);
    const appModules = await listAppModules.execute();

    return response.json(appModules);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { description } = request.body;

    const createAppModule = container.resolve(CreateAppModuleService);

    const appModule = await createAppModule.execute({ description });
    return response.json(appModule);
  }
}

export default AppModulesController;
