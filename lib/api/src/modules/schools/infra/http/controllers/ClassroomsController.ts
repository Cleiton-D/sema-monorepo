import { Request, Response } from 'express';
import { container } from 'tsyringe';

import privateRoute from '@shared/decorators/privateRoute';

import CreateClassroomService, {
  CreateClassroomRequest,
} from '@modules/schools/services/CreateClassroomService';
import CountClassroomsService from '@modules/schools/services/CountClassroomsService';
import ListClassroomsService, {
  ListClassroomsRequest,
} from '@modules/schools/services/ListClassroomsService';
import DeleteClassroomService from '@modules/schools/services/DeleteClassroomService';
import ShowClassroomService from '@modules/schools/services/ShowClassroomService';
import UpdateClassroomService, {
  UpdateClassroomRequest,
} from '@modules/schools/services/UpdateClassroomService';

class ClassroomsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { classroom_id } = request.params;

    const showClassroom = container.resolve(ShowClassroomService);
    const classroom = await showClassroom.execute({ classroom_id });

    return response.json(classroom);
  }

  @privateRoute({ module: 'CLASSROOM' })
  public async index(request: Request, response: Response): Promise<Response> {
    const {
      grade_id,
      class_period_id,
      employee_id,
      school_id,
      with_in_multigrades,
      with_multigrades,
      page,
      size,
    } = request.query;

    const listClassroomsRequest: ListClassroomsRequest = {
      grade_id: grade_id as string,
      class_period_id: class_period_id as string,
      employee_id: employee_id as string,
      page: page ? Number(page) : undefined,
      size: size ? Number(size) : undefined,
    };

    if (typeof with_in_multigrades !== 'undefined') {
      listClassroomsRequest.with_in_multigrades = Boolean(+with_in_multigrades);
    }
    if (typeof with_multigrades !== 'undefined') {
      listClassroomsRequest.with_multigrades = Boolean(+with_multigrades);
    }

    if (school_id === 'me') {
      const { branch_id } = request.profile;
      listClassroomsRequest.branch_id = branch_id;
    } else {
      listClassroomsRequest.school_id = school_id as string;
    }

    const listClassrooms = container.resolve(ListClassroomsService);
    const classrooms = await listClassrooms.execute(listClassroomsRequest);
    return response.json(classrooms);
  }

  public async count(request: Request, response: Response): Promise<Response> {
    const { class_period_id, grade_id, school_year_id, school_id } =
      request.query;

    const countClassrooms = container.resolve(CountClassroomsService);
    const result = await countClassrooms.execute({
      school_id: school_id as string,
      class_period_id: class_period_id as string,
      grade_id: grade_id as string,
      school_year_id: school_year_id as string,
    });

    return response.json(result);
  }

  @privateRoute({ module: 'CLASSROOM' })
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      description,
      class_period_id,
      grade_id,
      school_year_id,
      school_id,
      capacity,
      is_multigrade,
    } = request.body;

    const requestPayload: CreateClassroomRequest = {
      description,
      class_period_id,
      grade_id,
      school_year_id,
      capacity,
      is_multigrade,
    };

    if (school_id === 'me') {
      const { branch_id } = request.profile;
      requestPayload.branch_id = branch_id;
    } else {
      requestPayload.school_id = school_id;
    }

    const createClassroom = container.resolve(CreateClassroomService);
    const classroom = await createClassroom.execute(requestPayload);
    return response.json(classroom);
  }

  @privateRoute({ module: 'CLASSROOM' })
  public async update(request: Request, response: Response): Promise<Response> {
    const {
      description,
      class_period_id,
      grade_id,
      school_year_id,
      school_id,
      capacity,
      is_multigrade,
    } = request.body;
    const { classroom_id } = request.params;

    const requestPayload: UpdateClassroomRequest = {
      id: classroom_id,
      description,
      class_period_id,
      grade_id,
      school_year_id,
      capacity,
      is_multigrade,
    };

    if (school_id === 'me') {
      const { branch_id } = request.profile;
      requestPayload.branch_id = branch_id;
    } else {
      requestPayload.school_id = school_id;
    }

    const createClassroom = container.resolve(UpdateClassroomService);
    const classroom = await createClassroom.execute(requestPayload);
    return response.json(classroom);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { classroom_id } = request.params;

    const deleteClassroom = container.resolve(DeleteClassroomService);
    await deleteClassroom.execute({ classroom_id });

    return response.status(204).send();
  }
}

export default ClassroomsController;
