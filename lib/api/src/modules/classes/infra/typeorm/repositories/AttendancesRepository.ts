import {
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  WhereExpressionBuilder,
  In,
  SelectQueryBuilder,
} from 'typeorm';

import { dataSource } from '@config/data_source';

import IAttendancesRepository from '@modules/classes/repositories/IAttendancesRepository';
import FindAttendanceDTO from '@modules/classes/dtos/FindAttendanceDTO';
import CreateAttendanceDTO from '@modules/classes/dtos/CreateAttendanceDTO';
import {
  CountAttendancesDTO,
  CountAttendancesResponse,
} from '@modules/classes/dtos/CountAttendancesDTO';
import Attendance from '../entities/Attendance';

type AndWhere = {
  condition: string;
  parameters?: ObjectLiteral;
};

class AttendancesRepository implements IAttendancesRepository {
  private ormRepository: Repository<Attendance>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Attendance);
  }

  public async findAll({
    enroll_id,
    class_id,
    attendance,
    classroom_id,
  }: FindAttendanceDTO): Promise<Attendance[]> {
    const where: FindOptionsWhere<Attendance> = {};
    const andWhere: AndWhere[] = [];

    if (classroom_id) {
      andWhere.push({
        condition: 'class.classroom_id = :classroomId',
        parameters: { classroomId: classroom_id },
      });
    }
    if (enroll_id) where.enroll_id = enroll_id;
    if (class_id) {
      if (Array.isArray(class_id)) {
        where.class_id = In(class_id);
      } else {
        where.class_id = class_id;
      }
    }
    if (attendance) where.attendance = attendance;
    // if (classroom_id) {
    //   // TESTAR class.classroom_id IN
    //   andWhere.push({
    //     condition: `
    //       (
    //         (
    //           class_classroom.is_multigrade = false
    //           AND
    //           (
    //             class_classroom.id = :classroomId
    //             OR
    //             EXISTS (
    //               SELECT 1
    //                 FROM multiclasses multiclass
    //                WHERE multiclass.class_id = class.id
    //                  AND multiclass.classroom_id = enroll_classroom.classroom_id
    //                  AND multiclass.classroom_id = :classroomId
    //             )
    //           )
    //         )
    //         OR
    //         (
    //           class_classroom.id = :classroomId
    //           AND
    //           class_classroom.is_multigrade = true
    //           AND
    //           EXISTS (
    //             SELECT 1
    //               FROM multigrades_classrooms multigrade_classroom
    //              WHERE multigrade_classroom.owner_id = class_classroom.id
    //                AND multigrade_classroom.classroom_id = enroll_classroom.classroom_id
    //                AND deleted_at IS NULL
    //           )
    //         )
    //       )
    //     `,
    //     parameters: { classroomId: classroom_id },
    //   });
    // }

    const queryBuilder = this.ormRepository
      .createQueryBuilder('attendance')
      .select()
      .where((qb: WhereExpressionBuilder) => {
        qb.where(where);
        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      })
      .leftJoinAndSelect('attendance.enroll', 'enroll')
      .leftJoinAndSelect('enroll.student', 'student')
      .leftJoinAndSelect('attendance.class', 'class')
      .leftJoinAndSelect('class.classroom', 'class_classroom')
      .leftJoinAndSelect('enroll.enroll_classrooms', 'enroll_classrooms')
      .leftJoinAndSelect('class.school_subject', 'schoolSubject')
      .leftJoinAndSelect('attendance.enroll_classroom', 'enroll_classroom')
      .leftJoinAndSelect('enroll_classroom.classroom', 'classroom');

    return queryBuilder.getMany();
  }

  private createCountSubquery(
    {
      class_id,
      classroom_id,
      enroll_id,
      school_subject_id,
      attendance,
      split_by_school_subject,
      split_by_school_term,
    }: CountAttendancesDTO,
    queryBuilder: SelectQueryBuilder<any>,
  ): SelectQueryBuilder<any> {
    const where: FindOptionsWhere<Attendance> = {};
    const andWhere: AndWhere[] = [];

    if (classroom_id) {
      andWhere.push({
        condition: 'class.classroom_id = :classroomId',
        parameters: { classroomId: classroom_id },
      });
    }
    if (school_subject_id) {
      if (Array.isArray(school_subject_id)) {
        andWhere.push({
          condition: 'class.school_subject_id IN (:...schoolSubjectId)',
          parameters: { schoolSubjectId: school_subject_id },
        });
      } else {
        andWhere.push({
          condition: 'class.school_subject_id = :schoolSubjectId',
          parameters: { schoolSubjectId: school_subject_id },
        });
      }
    }

    if (enroll_id) where.enroll_id = enroll_id;
    if (class_id) {
      if (Array.isArray(class_id)) {
        where.class_id = In(class_id);
      } else {
        where.class_id = class_id;
      }
    }
    if (typeof attendance !== 'undefined') where.attendance = attendance;

    queryBuilder
      .from('attendances', 'attendance')
      .select('COUNT(1)', 'total')
      .addSelect(
        `SUM(
          CASE WHEN attendance.attendance THEN 1 ELSE 0 END
        )`,
        'attendances',
      )
      .addSelect(
        `SUM(
          CASE WHEN attendance.attendance THEN 0 ELSE 1 END
        )`,
        'absences',
      );

    queryBuilder
      .addSelect('attendance.enroll_id', 'enroll_id')
      .leftJoin('attendance.class', 'class')
      .where((_qb: WhereExpressionBuilder) => {
        _qb.where(where);
        andWhere.forEach(({ condition, parameters }) =>
          _qb.andWhere(condition, parameters),
        );
      })
      .addGroupBy('attendance.enroll_id');

    if (split_by_school_subject) {
      queryBuilder.addSelect('class.school_subject_id', 'school_subject_id');
      queryBuilder.addGroupBy('class.school_subject_id');
    }
    if (split_by_school_term) {
      queryBuilder.addSelect('class.school_term', 'school_term');
      queryBuilder.addGroupBy('class.school_term');
    }

    return queryBuilder;
  }

  public async count(
    filters: CountAttendancesDTO,
  ): Promise<CountAttendancesResponse[]> {
    const queryBuilder = dataSource
      .createQueryBuilder()
      .select('sbq.total', 'total')
      .addSelect('sbq.absences', 'absences')
      .addSelect('sbq.attendances', 'attendances')
      .addSelect('(sbq.attendances * 100) / sbq.total', 'attendances_percent')
      .addSelect('(sbq.absences * 100) / sbq.total', 'absences_percent')
      .addSelect('sbq.enroll_id')
      .from(qb => this.createCountSubquery(filters, qb), 'sbq');

    if (filters.split_by_school_subject) {
      queryBuilder.addSelect('sbq.school_subject_id');
    }
    if (filters.split_by_school_term) {
      queryBuilder.addSelect('sbq.school_term');
    }

    const result = await queryBuilder.getRawMany<CountAttendancesResponse>();

    return result.map(
      ({
        total,
        attendances,
        absences,
        attendances_percent,
        absences_percent,
        ...rest
      }) => {
        return {
          ...rest,
          total: Number(total),
          attendances: Number(attendances),
          absences: Number(absences),
          attendances_percent: Number(attendances_percent),
          absences_percent: Number(absences_percent),
        };
      },
    );
  }

  public async createMany(data: CreateAttendanceDTO[]): Promise<Attendance[]> {
    const attendances = data.map(
      ({ enroll_id, class_id, attendance, enroll_classroom_id }) =>
        this.ormRepository.create({
          enroll_id,
          class_id,
          attendance,
          enroll_classroom_id,
        }),
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
