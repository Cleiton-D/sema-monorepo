import { inject, injectable } from 'tsyringe';

import IEnrollClassroomsRepository from '@modules/enrolls/repositories/IEnrollClassroomsRepository';
import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';

import AppError from '@shared/errors/AppError';

import Attendance from '../infra/typeorm/entities/Attendance';
import IClassesRepository from '../repositories/IClassesRepository';
import IAttendancesRepository from '../repositories/IAttendancesRepository';

type AttendanceRequestType = {
  enroll_id: string;
  attendance: boolean;
};

type RegisterClassAttendancesRequest = {
  user_id: string;
  class_id: string;
  attendances: AttendanceRequestType[];
};

@injectable()
class RegisterClassAttendancesService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    @inject('ClassesRepository') private classesRepository: IClassesRepository,
    @inject('EnrollClassroomsRepository')
    private enrollClassroomsRepository: IEnrollClassroomsRepository,
    @inject('AttendancesRepository')
    private attendancesRepository: IAttendancesRepository,
  ) {}

  public async execute({
    user_id,
    class_id,
    attendances,
  }: RegisterClassAttendancesRequest): Promise<Attendance[]> {
    const enrollAttendances = attendances.reduce<Record<string, boolean>>(
      (acc, { enroll_id, attendance }) => ({
        ...acc,
        [enroll_id]: attendance,
      }),
      {},
    );

    const employee = await this.employeesRepository.findOne({ user_id });
    if (!employee) {
      throw new AppError('You cannot register an class');
    }

    const classEntity = await this.classesRepository.findOne({ id: class_id });
    if (!classEntity) {
      throw new AppError('class not found');
    }
    if (classEntity.employee_id !== employee.id) {
      throw new AppError(
        'only the teacher who registered the class can launch new appearances',
      );
    }

    const enrollsClassrooms = await this.enrollClassroomsRepository.findAll({
      classroom_id: classEntity.classroom_id,
    });

    Object.keys(enrollAttendances).forEach(enroll_id => {
      const enroll = enrollsClassrooms.find(
        enrollClassroom => enrollClassroom.enroll_id === enroll_id,
      );
      if (!enroll) {
        throw new AppError('Student not enrolled in this classroom');
      }
    });

    const currentAttendances = await this.attendancesRepository.findAll({
      class_id,
    });

    const newAttendances = currentAttendances.map(attendance => {
      const requestAttendance = enrollAttendances[attendance.enroll_id];
      if (requestAttendance === undefined) return attendance;

      return Object.assign(attendance, {
        attendance: requestAttendance,
      });
    });

    return this.attendancesRepository.updateMany(newAttendances);
  }
}

export default RegisterClassAttendancesService;
