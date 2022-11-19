import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import ListMultigradesService, {
  ListMultigradesRequest,
} from '@modules/schools/services/ListMultigradesService';
import privateRoute from '@shared/decorators/privateRoute';
import ShowMultigradeService from '@modules/schools/services/ShowMultigradeService';

class MultigradesController {
  @privateRoute({ module: 'CLASSROOM' })
  public async index(request: Request, response: Response): Promise<Response> {
    const { class_period_id, school_id } = request.query;

    const listMultigradesRequest: ListMultigradesRequest = {
      class_period_id: class_period_id as string,
    };
    if (school_id === 'me') {
      const { branch_id } = request.profile;
      listMultigradesRequest.branch_id = branch_id;
    } else {
      listMultigradesRequest.school_id = school_id as string;
    }

    const listMultigrades = container.resolve(ListMultigradesService);

    const multigrades = await listMultigrades.execute(listMultigradesRequest);
    return response.json(instanceToInstance(multigrades));
  }

  @privateRoute({ module: 'CLASSROOM' })
  public async show(request: Request, response: Response): Promise<Response> {
    const { multigrade_id } = request.params;

    const showMultigrade = container.resolve(ShowMultigradeService);

    const multigrade = await showMultigrade.execute({ multigrade_id });
    return response.json(instanceToInstance(multigrade));
  }
}

export default MultigradesController;
