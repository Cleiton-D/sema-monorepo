import { Request, Response } from 'express';
import { container } from 'tsyringe';

import LinkClassroomTeacherSchoolSubjectsService from '@modules/schools/services/LinkClassroomTeacherSchoolSubjectsService';
import ListClassroomTeacherSchoolSubjectsService from '@modules/schools/services/ListClassroomTeacherSchoolSubjectsService';
import DeleteClassroomTeacherSchoolSubjectService from '@modules/schools/services/DeleteClassroomTeacherSchoolSubjectService';
import ShowClassroomTeacherSchoolSubjectsService from '@modules/schools/services/ShowClassroomTeacherSchoolSubjectsService';

class ClassroomTeacherSchoolSubjectsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { classroom_teacher_school_subject_id } = request.params;

    const listClassroomTeacherSchoolSubjects = container.resolve(
      ShowClassroomTeacherSchoolSubjectsService,
    );

    const classroomTeacherSchoolSubjects =
      await listClassroomTeacherSchoolSubjects.execute({
        id: classroom_teacher_school_subject_id,
      });

    return response.json(classroomTeacherSchoolSubjects);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const {
      employee_id,
      school_subject_id,
      school_id,
      classroom_id,
      is_multidisciplinary,
    } = request.query;

    const listClassroomTeacherSchoolSubjects = container.resolve(
      ListClassroomTeacherSchoolSubjectsService,
    );

    const teacherSchoolSubjects =
      await listClassroomTeacherSchoolSubjects.execute({
        classroom_id: classroom_id as string,
        school_id: school_id as string,
        employee_id: employee_id as string,
        school_subject_id: school_subject_id as string,
        is_multidisciplinary: is_multidisciplinary
          ? Boolean(+is_multidisciplinary)
          : undefined,
      });

    return response.json(teacherSchoolSubjects);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { teacher_school_subjects, classroom_id } = request.body;

    const linkClassroomTeacherSchoolSubjects = container.resolve(
      LinkClassroomTeacherSchoolSubjectsService,
    );
    const classroomTeacherSchoolSubject =
      await linkClassroomTeacherSchoolSubjects.execute({
        classroom_id,
        teacher_school_subjects,
      });

    return response.json(classroomTeacherSchoolSubject);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { classroom_teacher_school_subject_id } = request.params;

    const deleteClassroomTeacherSchoolSubject = container.resolve(
      DeleteClassroomTeacherSchoolSubjectService,
    );

    await deleteClassroomTeacherSchoolSubject.execute({
      classroom_teacher_school_subject_id,
    });

    return response.status(204).send();
  }
}

export default ClassroomTeacherSchoolSubjectsController;
