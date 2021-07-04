import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateStudentService from '@modules/students/services/CreateStudentService';

class StudentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      documents,
      address,
      contacts,
    } = request.body;

    const createStudent = container.resolve(CreateStudentService);
    const student = await createStudent.execute({
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      documents,
      address,
      contacts,
    });

    return response.json(student);
  }
}

export default StudentsController;
