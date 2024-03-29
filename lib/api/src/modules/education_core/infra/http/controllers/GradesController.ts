import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateGradeService from '@modules/education_core/services/CreateGradeService';
import ListGradeService from '@modules/education_core/services/ListGradeService';

import privateRoute from '@shared/decorators/privateRoute';
import DeleteGradeService from '@modules/education_core/services/DeleteGradeService';
import CountGradesService from '@modules/education_core/services/CountGradesService';
import ShowGradeService from '@modules/education_core/services/ShowGradeService';

class GradesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { school_year_id } = request.query;

    const listGrades = container.resolve(ListGradeService);
    const grades = await listGrades.execute({
      school_year_id: school_year_id as string,
    });

    return response.json(grades);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { grade_id } = request.params;

    const showGrade = container.resolve(ShowGradeService);
    const grade = await showGrade.execute({
      id: grade_id,
    });

    return response.json(grade);
  }

  public async count(request: Request, response: Response): Promise<Response> {
    const { school_year_id } = request.query;

    const countGrades = container.resolve(CountGradesService);
    const countResult = await countGrades.execute({
      school_year_id: school_year_id as string,
    });

    return response.json(countResult);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { description, after_of, school_year_id } = request.body;

    const createGrade = container.resolve(CreateGradeService);
    const grade = await createGrade.execute({
      description,
      after_of,
      school_year_id,
    });

    return response.json(grade);
  }

  @privateRoute()
  public async delete(request: Request, response: Response): Promise<Response> {
    const { grade_id } = request.params;

    const deleteGrade = container.resolve(DeleteGradeService);
    await deleteGrade.execute({ grade_id });

    return response.status(204).send();
  }
}

export default GradesController;
