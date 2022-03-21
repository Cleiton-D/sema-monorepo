import {
  FindConditions,
  getRepository,
  In,
  ObjectLiteral,
  Repository,
  WhereExpression,
} from 'typeorm';

import ITimetablesRepository from '@modules/schools/repositories/ITimetablesRepository';
import FindTimetableDTO from '@modules/schools/dtos/FindTimetableDTO';
import CreateTimetableDTO from '@modules/schools/dtos/CreateTimetableDTO';

import Timetable from '../entities/Timetable';

type AndWhere = {
  condition: string;
  parameters?: ObjectLiteral;
};
class TimetablesRepository implements ITimetablesRepository {
  private ormRepository: Repository<Timetable>;

  constructor() {
    this.ormRepository = getRepository(Timetable);
  }

  public async findOne({
    id,
    employee_id,
    classroom_id,
    school_subject_id,
    day_of_week,
    time_start,
    time_end,
  }: FindTimetableDTO): Promise<Timetable | undefined> {
    const where: FindConditions<Timetable> = {};

    if (id) {
      if (Array.isArray(id)) {
        where.id = In(id);
      } else {
        where.id = id;
      }
    }
    if (employee_id) where.employee_id = employee_id;
    if (classroom_id) where.classroom_id = classroom_id;
    if (school_subject_id) where.school_subject_id = school_subject_id;
    if (day_of_week) where.day_of_week = day_of_week;
    if (time_start) where.time_start = time_start;
    if (time_end) where.time_end = time_end;

    const timetables = await this.ormRepository.findOne({
      where,
      relations: ['school_subject', 'employee'],
      join: {
        alias: 'timetable',
        leftJoinAndSelect: {
          classroom: 'timetable.classroom',
        },
      },
    });

    return timetables;
  }

  public async findAll(filters: FindTimetableDTO = {}): Promise<Timetable[]> {
    const {
      id,
      employee_id,
      school_id,
      classroom_id,
      school_subject_id,
      day_of_week,
      time_start,
      time_end,
    } = filters;

    const where: FindConditions<Timetable> = {};
    const andWhere: AndWhere[] = [];

    if (id) {
      if (Array.isArray(id)) {
        where.id = In(id);
      } else {
        where.id = id;
      }
    }
    if (employee_id) where.employee_id = employee_id;
    if (classroom_id) where.classroom_id = classroom_id;
    if (school_subject_id) where.school_subject_id = school_subject_id;
    if (day_of_week) where.day_of_week = day_of_week;
    if (time_start) where.time_start = time_start;
    if (time_end) where.time_end = time_end;

    if (school_id) {
      andWhere.push({
        condition: 'classroom.school_id = :schoolId',
        parameters: { schoolId: school_id },
      });
    }

    const timetables = await this.ormRepository.find({
      where: (qb: WhereExpression) => {
        qb.where(where);
        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      },
      relations: ['school_subject', 'employee'],
      join: {
        alias: 'timetable',
        leftJoinAndSelect: {
          classroom: 'timetable.classroom',
        },
      },
    });

    return timetables;
  }

  public async createMany(data: CreateTimetableDTO[]): Promise<Timetable[]> {
    const timetables = data.map(
      ({
        classroom_id,
        school_subject_id,
        employee_id,
        day_of_week,
        time_start,
        time_end,
      }) =>
        this.ormRepository.create({
          classroom_id,
          school_subject_id,
          employee_id,
          day_of_week,
          time_start,
          time_end,
        }),
    );

    await this.ormRepository.save(timetables);
    return timetables;
  }

  public async updateMany(timetables: Timetable[]): Promise<Timetable[]> {
    await this.ormRepository.save(timetables);
    return timetables;
  }

  public async deleteMany(timetables: Timetable[]): Promise<void> {
    await this.ormRepository.remove(timetables);
  }
}

export default TimetablesRepository;
