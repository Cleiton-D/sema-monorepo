import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSchoolSubjectService from '@modules/education_core/services/CreateSchoolSubjectService';
import ListSchoolSubjectService from '@modules/education_core/services/ListSchoolSubjectService';
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
    const { grade_id } = request.query;

    const listSchoolSubjects = container.resolve(ListSchoolSubjectService);
    const schoolSubject = await listSchoolSubjects.execute({
      grade_id: grade_id as string,
    });

    return response.json(schoolSubject);
  }

  public async count(request: Request, response: Response): Promise<Response> {
    const countSchoolSubjects = container.resolve(CountSchoolSubjectsService);
    const countResult = await countSchoolSubjects.execute();

    return response.json(countResult);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { description, additional_description, index } = request.body;

    const createSchoolSubject = container.resolve(CreateSchoolSubjectService);
    const schoolSubject = await createSchoolSubject.execute({
      description,
      additional_description,
      index,
    });

    return response.json(schoolSubject);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { school_subject_id } = request.params;
    const { description, additional_description, index } = request.body;

    const updateSchoolSubject = container.resolve(UpdateSchoolSubjectService);
    const schoolSubject = await updateSchoolSubject.execute({
      id: school_subject_id,
      description,
      additional_description,
      index,
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
