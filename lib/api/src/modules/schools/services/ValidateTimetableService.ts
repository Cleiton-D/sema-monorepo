import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IClassroomsRepository from '../repositories/IClassroomsRepository';
import ITimetablesRepository from '../repositories/ITimetablesRepository';
import Timetable, { DayOfWeek } from '../infra/typeorm/entities/Timetable';
import Classroom from '../infra/typeorm/entities/Classroom';

type ValidateTimetableRequest = {
  classroom_id: string;
  employee_id: string;
  day_of_week: DayOfWeek;
  time_start: string;
  time_end: string;
  include_current?: boolean;
};

type ValidateTimetableResponse = {
  existent?: Timetable;
  isValid: boolean;
};

type VefiryTimetableParams = {
  timetable: Timetable;
  classroom: Classroom;
  include_current: boolean;
};

@injectable()
class ValidateTimetableService {
  constructor(
    @inject('TimetablesRepository')
    private timetablesRepository: ITimetablesRepository,
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
  ) {}

  public async execute({
    employee_id,
    classroom_id,
    day_of_week,
    time_start,
    time_end,
    include_current = false,
  }: ValidateTimetableRequest): Promise<ValidateTimetableResponse> {
    const classroom = await this.classroomsRepository.findById(classroom_id);
    if (!classroom) {
      throw new AppError('Classroom not found.');
    }

    const timetables = await this.timetablesRepository.findAll({
      employee_id,
      day_of_week,
      time_start,
      time_end,
    });

    const existentTimetable = timetables.find(timetable =>
      this.verifyTimetable({
        timetable,
        classroom,
        include_current,
      }),
    );

    return {
      isValid: !existentTimetable,
      existent: existentTimetable,
    };
  }

  private verifyTimetable({
    timetable,
    classroom,
    include_current,
  }: VefiryTimetableParams): boolean {
    if (timetable.classroom.school_id !== classroom.school_id) {
      return false;
    }
    if (include_current && timetable?.classroom_id === classroom.id) {
      return true;
    }
    if (timetable.classroom_id !== classroom.id) {
      const existentClassroom = timetable.classroom;
      if (classroom.school_year_id === existentClassroom.school_year_id) {
        return true;
      }
    }

    return false;
  }
}

export default ValidateTimetableService;
