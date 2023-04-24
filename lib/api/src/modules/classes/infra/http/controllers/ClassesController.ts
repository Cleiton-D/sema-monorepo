import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import privateRoute from '@shared/decorators/privateRoute';
import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';

import RegisterClassService from '@modules/classes/services/RegisterClassService';
import ShowClassService from '@modules/classes/services/ShowClassService';
import ListClassesService from '@modules/classes/services/ListClassesService';
import FinishClassService from '@modules/classes/services/FinishClassService';
import CountClassesService from '@modules/classes/services/CountClassesService';
import UpdateClassService from '@modules/classes/services/UpdateClassService';
import DeleteClassService from '@modules/classes/services/DeleteClassService';

import { ClassStatus } from '../../typeorm/entities/Class';

class ClassesController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { class_id } = request.params;

    const showClass = container.resolve(ShowClassService);
    const classEntity = await showClass.execute({ class_id });

    return response.json(instanceToInstance(classEntity));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const {
      classroom_id,
      employee_id,
      school_subject_id,
      school_id,
      school_year_id,
      class_date,
      class_period_id,
      grade_id,
      status,
      taught_content,
      school_term,
      limit,
      sortBy,
      order,
      before,
      page,
      size,
    } = request.query;

    const listClasses = container.resolve(ListClassesService);
    const classes = await listClasses.execute({
      classroom_id: classroom_id as string,
      employee_id: employee_id as string,
      school_subject_id: school_subject_id as string,
      school_id: school_id as string,
      school_year_id: school_year_id as string,
      class_date: class_date as string,
      class_period_id: class_period_id as string,
      grade_id: grade_id as string,
      status: status as ClassStatus,
      taught_content: taught_content as string,
      school_term: school_term as SchoolTerm,
      limit: limit ? Number(limit) : undefined,
      sortBy: sortBy as string,
      order: order as 'ASC' | 'DESC',
      before: before as string,
      page: page ? Number(page) : undefined,
      size: size ? Number(size) : undefined,
    });

    return response.json(instanceToInstance(classes));
  }

  public async count(request: Request, response: Response): Promise<Response> {
    const { classroom_id, employee_id, school_subject_id, school_id } =
      request.query;

    const countClasses = container.resolve(CountClassesService);
    const countResult = await countClasses.execute({
      classroom_id: classroom_id as string,
      employee_id: employee_id as string,
      school_subject_id: school_subject_id as string,
      school_id: school_id as string,
    });

    return response.json(countResult);
  }

  @privateRoute()
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      classroom_id,
      school_subject_id,
      period,
      class_date,
      taught_content,
    } = request.body;
    const user_id = request.user.id;

    const registerClass = container.resolve(RegisterClassService);
    const classEntity = await registerClass.execute({
      user_id,
      classroom_id,
      school_subject_id,
      period,
      class_date,
      taught_content,
    });

    return response.json(instanceToInstance(classEntity));
  }

  @privateRoute()
  public async update(request: Request, response: Response): Promise<Response> {
    const { class_id } = request.params;
    const {
      school_subject_id,
      period,
      class_date,
      taught_content,
      school_term,
    } = request.body;
    const user_id = request.user.id;

    const updateClass = container.resolve(UpdateClassService);
    const classEntity = await updateClass.execute({
      class_id,
      user_id,
      school_subject_id,
      period,
      class_date,
      taught_content,
      school_term,
    });

    return response.json(instanceToInstance(classEntity));
  }

  @privateRoute()
  public async delete(request: Request, response: Response): Promise<Response> {
    const { class_id } = request.params;
    const user_id = request.user.id;

    const deleteClass = container.resolve(DeleteClassService);
    await deleteClass.execute({ class_id, user_id });

    return response.status(204).send();
  }

  public async finish(request: Request, response: Response): Promise<Response> {
    const { class_id } = request.params;

    const finishClass = container.resolve(FinishClassService);
    const classEntity = await finishClass.execute({ class_id });

    return response.json(instanceToInstance(classEntity));
  }
}

export default ClassesController;
