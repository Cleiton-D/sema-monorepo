import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateTeacherSchoolSubjectService from '@modules/schools/services/CreateTeacherSchoolSubjectService';
import ListTeacherSchoolSubjectsService from '@modules/schools/services/ListTeacherSchoolSubjectsService';
import DeleteTeacherSchoolSubjectService from '@modules/schools/services/DeleteTeacherSchoolSubjectService';

class TeacherSchoolSubjectsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { school_id } = request.params;
    const { school_subject_id } = request.query;

    const listTeacherSchoolSubjects = container.resolve(
      ListTeacherSchoolSubjectsService,
    );

    const teacherSchoolSubjects = await listTeacherSchoolSubjects.execute({
      school_id,
      school_subject_id: school_subject_id as string,
    });

    return response.json(teacherSchoolSubjects);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { school_id } = request.params;
    const { employee_id, school_subject_id } = request.body;

    const createTeacherSchoolSubjects = container.resolve(
      CreateTeacherSchoolSubjectService,
    );
    const teacherSchoolSubjects = await createTeacherSchoolSubjects.execute({
      employee_id,
      school_subject_id,
      school_id,
    });

    return response.json(teacherSchoolSubjects);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { teacher_school_subject_id } = request.params;

    const deleteTeacherSchoolSubject = container.resolve(
      DeleteTeacherSchoolSubjectService,
    );

    await deleteTeacherSchoolSubject.execute({ teacher_school_subject_id });
    return response.status(204).send();
  }
}

export default TeacherSchoolSubjectsController;
