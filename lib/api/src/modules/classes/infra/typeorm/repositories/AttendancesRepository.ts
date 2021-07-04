import {
  FindConditions,
  getRepository,
  ObjectLiteral,
  Repository,
  WhereExpression,
} from 'typeorm';

import IAttendancesRepository from '@modules/classes/repositories/IAttendancesRepository';
import FindAttendanceDTO from '@modules/classes/dtos/FindAttendanceDTO';
import CreateAttendanceDTO from '@modules/classes/dtos/CreateAttendanceDTO';
import Attendance from '../entities/Attendance';

type AndWhere = {
  condition: string;
  parameters?: ObjectLiteral;
};

class AttendancesRepository implements IAttendancesRepository {
  private ormRepository: Repository<Attendance>;

  constructor() {
    this.ormRepository = getRepository(Attendance);
  }

  public async findAll({
    enroll_id,
    class_id,
    attendance,
    classroom_id,
  }: FindAttendanceDTO): Promise<Attendance[]> {
    const where: FindConditions<Attendance> = {};
    const andWhere: AndWhere[] = [];

    if (enroll_id) where.enroll_id = enroll_id;
    if (class_id) where.class_id = class_id;
    if (attendance) where.attendance = attendance;
    if (classroom_id) {
      andWhere.push({
        condition: 'class.classroom_id = :classroomId',
        parameters: { classroomId: classroom_id },
      });
    }

    const attendances = await this.ormRepository.find({
      where: (qb: WhereExpression) => {
        qb.where(where);
        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      },
      join: {
        alias: 'attendance',
        leftJoinAndSelect: {
          enroll: 'attendance.enroll',
          person: 'enroll.person',
          class: 'attendance.class',
          classroom: 'class.classroom',
        },
      },
    });

    return attendances;
  }

  public async createMany(data: CreateAttendanceDTO[]): Promise<Attendance[]> {
    const attendances = data.map(({ enroll_id, class_id, attendance }) =>
      this.ormRepository.create({ enroll_id, class_id, attendance }),
    );

    await this.ormRepository.save(attendances);
    return attendances;
  }

  public async updateMany(attendances: Attendance[]): Promise<Attendance[]> {
    await this.ormRepository.save(attendances);
    return attendances;
  }
}

export default AttendancesRepository;
