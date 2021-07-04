import { Request, Response } from 'express';
import { container } from 'tsyringe';

import privateRoute from '@shared/decorators/privateRoute';

import RegisterClassAttendancesService from '@modules/classes/services/RegisterClassAttendancesService';
import ListAttendancesService from '@modules/classes/services/ListAttendancesService';

class AttendancesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { class_id } = request.params;
    const { classroom_id } = request.query;

    const listAttendances = container.resolve(ListAttendancesService);
    const attendances = await listAttendances.execute({
      class_id,
      classroom_id: classroom_id as string,
    });

    return response.json(attendances);
  }

  @privateRoute()
  public async update(request: Request, response: Response): Promise<Response> {
    const { class_id } = request.params;
    const { attendances } = request.body;
    const { id: user_id } = request.user;

    const registerClassAttendances = container.resolve(
      RegisterClassAttendancesService,
    );

    const updatedAttendances = await registerClassAttendances.execute({
      class_id,
      user_id,
      attendances,
    });

    return response.json(updatedAttendances);
  }
}

export default AttendancesController;
