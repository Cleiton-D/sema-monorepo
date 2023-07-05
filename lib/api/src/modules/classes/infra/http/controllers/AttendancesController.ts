import { Request, Response } from 'express';
import { container } from 'tsyringe';

import privateRoute from '@shared/decorators/privateRoute';
import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';

import RegisterClassAttendancesService from '@modules/classes/services/RegisterClassAttendancesService';
import ListAttendancesService, {
  ListAttendancesRequest,
} from '@modules/classes/services/ListAttendancesService';
import CountAttendancesService from '@modules/classes/services/CountAttendancesService';
import ListAttendancesByClassesService from '@modules/classes/services/ListAttendancesByClassesService';
import JustifyAbsenceService from '@modules/classes/services/JustifyAbsenceService';
import RemoveAbsenceJustificationService from '@modules/classes/services/RemoveAbsenceJustificationService';

import AddClassAttendancesService from '@modules/classes/services/AddClassAttendancesService';
import { ClassStatus } from '../../typeorm/entities/Class';

class AttendancesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { classroom_id, enroll_id, class_id, attendance } = request.query;

    const listAttendancesRequest: ListAttendancesRequest = {
      class_id: class_id as string,
      classroom_id: classroom_id as string,
      enroll_id: enroll_id as string,
    };

    if (typeof attendance !== undefined && attendance !== null) {
      listAttendancesRequest.attendance = Boolean(Number(attendance));
    }

    const listAttendances = container.resolve(ListAttendancesService);
    const attendances = await listAttendances.execute(listAttendancesRequest);

    return response.json(attendances);
  }

  public async count(request: Request, response: Response): Promise<Response> {
    const {
      class_id,
      classroom_id,
      enroll_id,
      school_subject_id,
      attendance,
      split_by_school_subject,
      split_by_school_term,
    } = request.query;

    const countAttendances = container.resolve(CountAttendancesService);
    const attendances = await countAttendances.execute({
      class_id: class_id as string,
      classroom_id: classroom_id as string,
      enroll_id: enroll_id as string,
      school_subject_id: school_subject_id as string,
      attendance: attendance ? Boolean(+attendance) : undefined,
      split_by_school_subject: split_by_school_subject
        ? Boolean(+split_by_school_subject)
        : undefined,
      split_by_school_term: split_by_school_term
        ? Boolean(+split_by_school_term)
        : undefined,
    });

    return response.json(attendances);
  }

  public async indexByClasses(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      classroom_id,
      employee_id,
      school_subject_id,
      school_id,
      class_date,
      class_period_id,
      grade_id,
      status,
      school_term,
      limit,
      sortBy,
      order,
      before,
      enroll_id,
    } = request.query;

    const listAttendancesByClasses = container.resolve(
      ListAttendancesByClassesService,
    );
    const attendances = await listAttendancesByClasses.execute({
      classroom_id: classroom_id as string,
      employee_id: employee_id as string,
      school_subject_id: school_subject_id as string,
      school_id: school_id as string,
      class_date: class_date as string,
      class_period_id: class_period_id as string,
      grade_id: grade_id as string,
      status: status as ClassStatus,
      school_term: school_term as SchoolTerm,
      limit: limit ? Number(limit) : undefined,
      sortBy: sortBy as string,
      order: order as 'ASC' | 'DESC',
      before: before as string,
      enroll_id: enroll_id as string,
    });

    return response.json(attendances);
  }

  @privateRoute()
  public async update(request: Request, response: Response): Promise<Response> {
    const { attendances, class_id } = request.body;
    const { id: user_id } = request.user;

    const registerClassAttendances = container.resolve(
      RegisterClassAttendancesService,
    );

    const updatedAttendances = await registerClassAttendances.execute({
      class_id,
      user_id,
      attendances,
    });

    return response.json(updatedAttendances);
  }

  @privateRoute()
  public async add(request: Request, response: Response): Promise<Response> {
    const { enroll_classroom_id, class_id } = request.body;

    const addClassAttendance = container.resolve(AddClassAttendancesService);

    const createdAttendance = await addClassAttendance.execute({
      enroll_classroom_id,
      class_id,
    });

    return response.json(createdAttendance);
  }

  public async justify(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { attendance_id } = request.params;
    const { description } = request.body;

    const justifyAbsence = container.resolve(JustifyAbsenceService);
    const updatedAttendance = await justifyAbsence.execute({
      attendanceId: attendance_id,
      description,
    });

    return response.json(updatedAttendance);
  }

  public async removeJustify(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { attendance_id } = request.params;

    const removeAbsenceJustification = container.resolve(
      RemoveAbsenceJustificationService,
    );
    const updatedAttendance = await removeAbsenceJustification.execute({
      attendance_id,
    });

    return response.json(updatedAttendance);
  }
}

export default AttendancesController;
