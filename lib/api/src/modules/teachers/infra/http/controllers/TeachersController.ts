import { Request, Response } from 'express';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';
import ListTeachersService from '@modules/teachers/services/ListTeachersService';

class TeachersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { school_id } = request.query;

    const listTeachers = container.resolve(ListTeachersService);
    const teachers = await listTeachers.execute({
      school_id: school_id as string,
    });

    return response.json(instanceToInstance(teachers));
  }
}

export default TeachersController;
