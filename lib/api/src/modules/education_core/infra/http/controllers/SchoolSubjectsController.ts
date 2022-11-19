import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSchoolSubjectService from '@modules/education_core/services/CreateSchoolSubjectService';
import ListSchoolSubjectService, {
  ListSchoolSubjectsRequest,
} from '@modules/education_core/services/ListSchoolSubjectService';
import UpdateSchoolSubjectService from '@modules/education_core/services/UpdateSchoolSubjectService';
import DeleteSchoolSubjectService from '@modules/education_core/services/DeleteSchoolSubjectsService';
import ShowSchoolSubjectService from '@modules/education_core/services/ShowSchoolSubjectService';
import CountSchoolSubjectsService from '@modules/education_core/services/CountSchoolSubjectsService';

class SchoolSubjectsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { school_subject_id } = request.params;

    const showSchoolSubject = container.resolve(ShowSchoolSubjectService);
    const schoolSubject = await showSchoolSubject.execute({
      school_subject_id,
    });

    return response.json(schoolSubject);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { grade_id, include_multidisciplinary, is_multidisciplinary } =
      request.query;

    const listSchoolSubjectsRequest: ListSchoolSubjectsRequest = {
      grade_id: grade_id as string,
    };

    if (typeof include_multidisciplinary !== 'undefined') {
      listSchoolSubjectsRequest.include_multidisciplinary = Boolean(
        +include_multidisciplinary,
      );
    }

    if (typeof is_multidisciplinary !== 'undefined') {
      listSchoolSubjectsRequest.is_multidisciplinary = Boolean(
        +is_multidisciplinary,
      );
    }

    const listSchoolSubjects = container.resolve(ListSchoolSubjectService);
    const schoolSubject = await listSchoolSubjects.execute(
      listSchoolSubjectsRequest,
    );

    return response.json(schoolSubject);
  }

  public async count(request: Request, response: Response): Promise<Response> {
    const countSchoolSubjects = container.resolve(CountSchoolSubjectsService);
    const countResult = await countSchoolSubjects.execute();

    return response.json(countResult);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { description, additional_description, index, is_multidisciplinary } =
      request.body;

    const createSchoolSubject = container.resolve(CreateSchoolSubjectService);
    const schoolSubject = await createSchoolSubject.execute({
      description,
      additional_description,
      index,
      is_multidisciplinary,
    });

    return response.json(schoolSubject);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { school_subject_id } = request.params;
    const { description, additional_description, index, is_multidisciplinary } =
      request.body;

    const updateSchoolSubject = container.resolve(UpdateSchoolSubjectService);
    const schoolSubject = await updateSchoolSubject.execute({
      id: school_subject_id,
      description,
      additional_description,
      index,
      is_multidisciplinary,
    });

    return response.json(schoolSubject);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { school_subject_id } = request.params;

    const deleteSchoolSubject = container.resolve(DeleteSchoolSubjectService);
    await deleteSchoolSubject.execute({ school_subject_id });

    return response.status(204).send();
  }
}

export default SchoolSubjectsController;
