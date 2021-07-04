import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import privateRoute from '@shared/decorators/privateRoute';

import CreateEnrollService from '@modules/enrolls/services/CreateEnrollService';
import CountEnrollsService from '@modules/enrolls/services/CountEnrollsService';
import ListEnrollsService from '@modules/enrolls/services/ListEnrollsService';
import ShowEnrollService from '@modules/enrolls/services/ShowEnrollServicde';

import { EnrollStatus } from '../../typeorm/entities/Enroll';

class EnrollsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { enroll_id } = request.params;

    const showEnroll = container.resolve(ShowEnrollService);
    const enroll = await showEnroll.execute({ enroll_id });

    return response.json(classToClass(enroll));
  }

  @privateRoute({ module: 'ENROLL' })
  public async index(request: Request, response: Response): Promise<Response> {
    const { classroom_id, school_id, grade_id } = request.query;

    const listEnrolls = container.resolve(ListEnrollsService);
    if (school_id === 'me') {
      const { branch_id } = request.profile;

      const enrolls = await listEnrolls.execute({
        classroom_id: classroom_id as string,
        branch_id,
        grade_id: grade_id as string,
      });

      return response.json(classToClass(enrolls));
    }

    const enrolls = await listEnrolls.execute({
      classroom_id: classroom_id as string,
      school_id: school_id as string,
      grade_id: grade_id as string,
    });

    return response.json(classToClass(enrolls));
  }

  public async count(request: Request, response: Response): Promise<Response> {
    const { grade_id, school_id, school_year_id, status } = request.query;

    const countEnrolls = container.resolve(CountEnrollsService);
    const count = await countEnrolls.execute({
      grade_id: grade_id as string,
      school_id: school_id as string,
      school_year_id: school_year_id as string,
      status: status as EnrollStatus,
    });

    return response.json(count);
  }

  @privateRoute({ module: 'ENROLL' })
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      person,
      school_id,
      grade_id,
      classroom_id,
      school_year_id,
    } = request.body;

    const createEnroll = container.resolve(CreateEnrollService);
    if (school_id === 'me') {
      const { branch_id } = request.profile;

      const enroll = await createEnroll.execute({
        person,
        branch_id,
        grade_id,
        classroom_id,
        school_year_id,
      });

      return response.json(enroll);
    }
    const enroll = await createEnroll.execute({
      person,
      school_id,
      grade_id,
      classroom_id,
      school_year_id,
    });

    return response.json(enroll);
  }
}

export default EnrollsController;
