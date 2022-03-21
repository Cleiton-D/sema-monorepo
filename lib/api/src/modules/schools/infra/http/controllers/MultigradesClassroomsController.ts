import { Request, Response } from 'express';
import { container } from 'tsyringe';

import privateRoute from '@shared/decorators/privateRoute';
import ListMultigradesClassroomsService from '@modules/schools/services/ListMultigradesClassroomsService';
import CreateMultigradeClassroomService from '@modules/schools/services/CreateMultigradeClassroomService';
import DeleteMultigradeClassroomService from '@modules/schools/services/DeleteMultigradeClassroomService';

class MultigradesClassroomsController {
  @privateRoute({ module: 'CLASSROOM' })
  public async index(request: Request, response: Response): Promise<Response> {
    const { owner_id } = request.params;

    const listMultigradesClassrooms = container.resolve(
      ListMultigradesClassroomsService,
    );

    const multigradesClassrooms = await listMultigradesClassrooms.execute({
      owner_id,
    });
    return response.json(multigradesClassrooms);
  }

  @privateRoute({ module: 'CLASSROOM' })
  public async create(request: Request, response: Response): Promise<Response> {
    const { owner_id } = request.params;
    const { classroom_id } = request.body;

    const createMultigradeClassroom = container.resolve(
      CreateMultigradeClassroomService,
    );

    const multigradeClassroom = await createMultigradeClassroom.execute({
      owner_id,
      classroom_id,
    });
    return response.json(multigradeClassroom);
  }

  @privateRoute({ module: 'CLASSROOM' })
  public async delete(request: Request, response: Response): Promise<Response> {
    const { multigrade_classroom_id } = request.params;

    const deleteMultigradeClassroom = container.resolve(
      DeleteMultigradeClassroomService,
    );

    await deleteMultigradeClassroom.execute({
      multigrade_classroom_id,
    });

    return response.status(204).send();
  }
}

export default MultigradesClassroomsController;
