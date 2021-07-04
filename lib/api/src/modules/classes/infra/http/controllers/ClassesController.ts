import { Request, Response } from 'express';
import { container } from 'tsyringe';

import privateRoute from '@shared/decorators/privateRoute';

import RegisterClassService from '@modules/classes/services/RegisterClassService';
import ShowClassService from '@modules/classes/services/ShowClassService';
import ListClassesService from '@modules/classes/services/ListClassesService';
import FinishClassService from '@modules/classes/services/FinishClassService';
import CountClassesService from '@modules/classes/services/CountClassesService';

class ClassesController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { class_id } = request.params;

    const showClass = container.resolve(ShowClassService);
    const classEntity = await showClass.execute({ class_id });

    return response.json(classEntity);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { classroom_id, employee_id, school_subject_id } = request.query;

    const listClasses = container.resolve(ListClassesService);
    const classes = await listClasses.execute({
      classroom_id: classroom_id as string,
      employee_id: employee_id as string,
      school_subject_id: school_subject_id as string,
    });

    return response.json(classes);
  }

  public async count(request: Request, response: Response): Promise<Response> {
    const { classroom_id, employee_id, school_subject_id } = request.query;

    const countClasses = container.resolve(CountClassesService);
    const countResult = await countClasses.execute({
      classroom_id: classroom_id as string,
      employee_id: employee_id as string,
      school_subject_id: school_subject_id as string,
    });

    return response.json(countResult);
  }

  @privateRoute()
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      classroom_id,
      school_subject_id,
      class_date,
      time_start,
      taught_content,
    } = request.body;
    const user_id = request.user.id;

    const registerClass = container.resolve(RegisterClassService);
    const classEntity = await registerClass.execute({
      user_id,
      classroom_id,
      school_subject_id,
      class_date,
      time_start,
      taught_content,
    });

    return response.json(classEntity);
  }

  public async finish(request: Request, response: Response): Promise<Response> {
    const { class_id } = request.params;

    const finishClass = container.resolve(FinishClassService);
    const classEntity = await finishClass.execute({ class_id });

    return response.json(classEntity);
  }
}

export default ClassesController;
