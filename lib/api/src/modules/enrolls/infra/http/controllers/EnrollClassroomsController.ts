import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListEnrollClassroomsService from '@modules/enrolls/services/ListEnrollClassroomsService';
import { classToClass } from 'class-transformer';

class EnrollClassroomsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { classroom_id, enroll_id, status } = request.query;

    const listEnrollClassrooms = container.resolve(ListEnrollClassroomsService);
    const enrollClassrooms = await listEnrollClassrooms.execute({
      classroom_id: classroom_id as string,
      enroll_id: enroll_id as string[],
      status: status as string,
    });

    return response.json(classToClass(enrollClassrooms));
  }
}

export default EnrollClassroomsController;
