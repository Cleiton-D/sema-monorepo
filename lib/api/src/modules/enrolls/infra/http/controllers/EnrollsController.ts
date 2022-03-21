import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import privateRoute from '@shared/decorators/privateRoute';

import CreateEnrollService from '@modules/enrolls/services/CreateEnrollService';
import CountEnrollsService from '@modules/enrolls/services/CountEnrollsService';
import ListEnrollsService, {
  ListEnrollsRequest,
} from '@modules/enrolls/services/ListEnrollsService';
import ShowEnrollService from '@modules/enrolls/services/ShowEnrollServicde';
import RelocateEnrollService from '@modules/enrolls/services/RelocateEnrollService';

import UpdateEnrollService from '@modules/enrolls/services/UpdateEnrollService';
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
    const {
      classroom_id,
      school_id,
      grade_id,
      class_period_id,
      status,
      student_name,
      student_cpf,
      student_nis,
      student_birth_certificate,
      order,
    } = request.query;

    const filters: ListEnrollsRequest = {
      classroom_id: classroom_id as string,
      grade_id: grade_id as string,
      class_period_id: class_period_id as string,
      student_name: student_name as string,
      student_cpf: student_cpf as string,
      student_nis: student_nis as string,
      student_birth_certificate: student_birth_certificate as string,
      status: status as EnrollStatus,
      order: order as string[],
    };
    if (school_id === 'me') {
      filters.branch_id = request.profile.branch_id;
    } else {
      filters.school_id = school_id as string;
    }

    const listEnrolls = container.resolve(ListEnrollsService);
    const enrolls = await listEnrolls.execute(filters);

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
      student,
      school_id,
      grade_id,
      classroom_id,
      school_year_id,
      origin,
      school_reports,
      class_period_id,
      enroll_date,
    } = request.body;

    const createEnroll = container.resolve(CreateEnrollService);
    if (school_id === 'me') {
      const { branch_id } = request.profile;

      const enroll = await createEnroll.execute({
        student,
        branch_id,
        grade_id,
        classroom_id,
        school_year_id,
        origin,
        school_reports,
        class_period_id,
        enroll_date,
      });

      return response.json(enroll);
    }
    const enroll = await createEnroll.execute({
      student,
      school_id,
      grade_id,
      classroom_id,
      school_year_id,
      origin,
      school_reports,
      class_period_id,
      enroll_date,
    });

    return response.json(enroll);
  }

  @privateRoute({ module: 'ENROLL' })
  public async update(request: Request, response: Response): Promise<Response> {
    const { enroll_id } = request.params;
    const { status } = request.body;

    const updateEnroll = container.resolve(UpdateEnrollService);
    const updatedEnroll = await updateEnroll.execute({
      enroll_id,
      status,
    });

    return response.json(classToClass(updatedEnroll));
  }

  @privateRoute({ module: 'ENROLL' })
  public async relocate(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { enroll_id } = request.params;
    const { from, to } = request.body;

    const relocateEnroll = container.resolve(RelocateEnrollService);
    const relocatedEnroll = await relocateEnroll.execute({
      enroll_id,
      from,
      to,
    });

    return response.json(classToClass(relocatedEnroll));
  }
}

export default EnrollsController;
