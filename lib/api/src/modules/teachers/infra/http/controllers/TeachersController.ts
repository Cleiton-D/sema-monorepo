import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import CreateTeacherService from '@modules/teachers/services/CreateTeacherService';

class TeachersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      person_id,
      name,
      mother_name,
      dad_name,
      gender,
      birth_date,
      address,
      documents,
      contacts,
      pis_pasep,
      education_level,
    } = request.body;

    const createTeacher = container.resolve(CreateTeacherService);
    const teacher = await createTeacher.execute({
      person_id,
      name,
      mother_name,
      dad_name,
      gender,
      birth_date,
      address,
      documents,
      contacts,
      pis_pasep,
      education_level,
    });

    return response.json(classToClass(teacher));
  }
}

export default TeachersController;
