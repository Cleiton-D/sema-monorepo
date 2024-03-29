import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import CreateGradeSchoolSubjectsService from '@modules/education_core/services/CreateGradeSchoolSubjectsService';
import ListGradeSchoolSubjectsService, {
  ListGradeSchoolSubjectsRequest,
} from '@modules/education_core/services/ListGradeSchoolSubjectsService';
import DeleteGradeSchoolSubjectService from '@modules/education_core/services/DeleteGradeSchoolSubjectService';
import UpdateGradeSchoolSubjectService from '@modules/education_core/services/UpdateGradeSchoolSubjectService';

class GradeSchoolSubjectsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { grade_id } = request.params;
    const {
      school_subject_id,
      is_multidisciplinary,
      include_multidisciplinary,
    } = request.query;

    const listGradeSchoolSubjectsRequest: ListGradeSchoolSubjectsRequest = {
      grade_id,
      school_subject_id: school_subject_id as string,
    };

    if (typeof is_multidisciplinary !== 'undefined') {
      listGradeSchoolSubjectsRequest.is_multidisciplinary = Boolean(
        +is_multidisciplinary,
      );
    }

    if (typeof include_multidisciplinary !== 'undefined') {
      listGradeSchoolSubjectsRequest.include_multidisciplinary = Boolean(
        +include_multidisciplinary,
      );
    }

    const listGradeSchoolSubjects = container.resolve(
      ListGradeSchoolSubjectsService,
    );

    const gradeSchoolSubjects = await listGradeSchoolSubjects.execute(
      listGradeSchoolSubjectsRequest,
    );

    return response.json(instanceToInstance(gradeSchoolSubjects));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { grade_id } = request.params;
    const { school_subjects } = request.body;

    const createGradeSchoolSubjects = container.resolve(
      CreateGradeSchoolSubjectsService,
    );
    const gradeSchoolSubjects = await createGradeSchoolSubjects.execute({
      grade_id,
      school_subjects,
    });

    return response.json(gradeSchoolSubjects);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { grade_school_subject_id } = request.params;
    const { workload } = request.body;

    const updateGradeSchoolSubjectService = container.resolve(
      UpdateGradeSchoolSubjectService,
    );
    const gradeSchoolSubject = await updateGradeSchoolSubjectService.execute({
      grade_school_subject_id,
      workload,
    });

    return response.json(gradeSchoolSubject);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { grade_school_subject_id } = request.params;

    const deleteGradeSchoolSubject = container.resolve(
      DeleteGradeSchoolSubjectService,
    );

    await deleteGradeSchoolSubject.execute({ grade_school_subject_id });

    return response.status(204).send();
  }
}

export default GradeSchoolSubjectsController;
