import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';
import ListTeachersService from '@modules/teachers/services/ListTeachersService';

class TeachersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listTeachers = container.resolve(ListTeachersService);
    const teachers = await listTeachers.execute();

    return response.json(classToClass(teachers));
  }
}

export default TeachersController;
