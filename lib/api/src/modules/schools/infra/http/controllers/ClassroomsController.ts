import { Request, Response } from 'express';
import { container } from 'tsyringe';

import privateRoute from '@shared/decorators/privateRoute';

import CreateClassroomService from '@modules/schools/services/CreateClassroomService';
import CountClassroomsService from '@modules/schools/services/CountClassroomsService';
import ListClassroomsService from '@modules/schools/services/ListClassroomsService';
import DeleteClassroomService from '@modules/schools/services/DeleteClassroomService';
import ShowClassroomService from '@modules/schools/services/ShowClassroomService';
import { ClassPeriodType } from '../../typeorm/entities/Classroom';

class ClassroomsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { classroom_id } = request.params;

    const showClassroom = container.resolve(ShowClassroomService);
    const classroom = await showClassroom.execute({ classroom_id });

    return response.json(classroom);
  }

  @privateRoute({ module: 'CLASSROOM' })
  public async index(request: Request, response: Response): Promise<Response> {
    const { school_id } = request.params;
    const { grade_id, class_period } = request.query;

    const listClassrooms = container.resolve(ListClassroomsService);
    if (school_id === 'me') {
      const { branch_id } = request.profile;
      const classrooms = await listClassrooms.execute({
        branch_id,
        grade_id: grade_id as string,
        class_period: class_period as ClassPeriodType,
      });
      return response.json(classrooms);
    }

    const classrooms = await listClassrooms.execute({
      school_id,
      grade_id: grade_id as string,
      class_period: class_period as ClassPeriodType,
    });
    return response.json(classrooms);
  }

  public async count(request: Request, response: Response): Promise<Response> {
    const { school_id } = request.params;
    const { class_period, grade_id, school_year_id } = request.query;

    const countClassrooms = container.resolve(CountClassroomsService);
    const result = await countClassrooms.execute({
      school_id,
      class_period: class_period as ClassPeriodType,
      grade_id: grade_id as string,
      school_year_id: school_year_id as string,
    });

    return response.json(result);
  }

  @privateRoute({ module: 'CLASSROOM' })
  public async create(request: Request, response: Response): Promise<Response> {
    const { school_id } = request.params;
    const {
      description,
      class_period,
      grade_id,
      school_year_id,
    } = request.body;

    const createClassroom = container.resolve(CreateClassroomService);
    if (school_id === 'me') {
      const { branch_id } = request.profile;

      const classroom = await createClassroom.execute({
        description,
        class_period,
        grade_id,
        branch_id,
        school_year_id,
      });

      return response.json(classroom);
    }
    const classroom = await createClassroom.execute({
      description,
      class_period,
      grade_id,
      school_id,
      school_year_id,
    });

    return response.json(classroom);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { school_id, classroom_id } = request.params;

    const deleteClassroom = container.resolve(DeleteClassroomService);
    await deleteClassroom.execute({ classroom_id, school_id });

    return response.status(204).send();
  }
}

export default ClassroomsController;
