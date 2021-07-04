import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSchoolTeacherService from '@modules/schools/services/CreateSchoolTeacherService';
import ListSchoolTeachersService from '@modules/schools/services/ListSchoolTeachersService';
import DeleteSchoolTeacherService from '@modules/schools/services/DeleteSchoolTeacherService';
import CountSchoolTeachersService from '@modules/schools/services/CountSchoolTeachersService';

class SchoolTeachersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { school_id } = request.params;

    const listSchoolTeachers = container.resolve(ListSchoolTeachersService);
    const schoolTeachers = await listSchoolTeachers.execute({ school_id });

    return response.json(schoolTeachers);
  }

  public async count(request: Request, response: Response): Promise<Response> {
    const { school_id } = request.params;

    const countSchoolTeachers = container.resolve(CountSchoolTeachersService);
    const countResult = await countSchoolTeachers.execute({ school_id });

    return response.json(countResult);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { school_id } = request.params;
    const { employee_id } = request.body;

    const createSchoolTeacher = container.resolve(CreateSchoolTeacherService);
    const schoolTeacher = await createSchoolTeacher.execute({
      school_id,
      employee_id,
    });

    return response.json(schoolTeacher);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { school_teacher_id } = request.params;

    const deleteSchoolTeacher = container.resolve(DeleteSchoolTeacherService);
    await deleteSchoolTeacher.execute({ school_teacher_id });

    return response.status(204).send();
  }
}

export default SchoolTeachersController;
