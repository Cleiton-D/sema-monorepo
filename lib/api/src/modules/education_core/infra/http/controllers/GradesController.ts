import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateGradeService from '@modules/education_core/services/CreateGradeService';
import ListGradeService from '@modules/education_core/services/ListGradeService';

import privateRoute from '@shared/decorators/privateRoute';
import DeleteGradeService from '@modules/education_core/services/DeleteGradeService';
import CountGradesService from '@modules/education_core/services/CountGradesService';

class GradesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listGrades = container.resolve(ListGradeService);
    const grade = await listGrades.execute();

    return response.json(grade);
  }

  public async count(request: Request, response: Response): Promise<Response> {
    const countGrades = container.resolve(CountGradesService);
    const countResult = await countGrades.execute();

    return response.json(countResult);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { description, after_of } = request.body;

    const createGrade = container.resolve(CreateGradeService);
    const grade = await createGrade.execute({ description, after_of });

    return response.json(grade);
  }

  @privateRoute()
  public async delete(request: Request, response: Response): Promise<Response> {
    const { grade_id } = request.params;
    // const { id: authenticated_grade } = request.grade;

    const deleteGrade = container.resolve(DeleteGradeService);
    await deleteGrade.execute({ grade_id });

    return response.status(204).send();
  }
}

export default GradesController;
