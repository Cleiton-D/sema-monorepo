import { inject, injectable } from 'tsyringe';

import Timetable, { DayOfWeek } from '../infra/typeorm/entities/Timetable';
import ITimetablesRepository from '../repositories/ITimetablesRepository';

type ListTimetablesRequest = {
  employee_id?: string;
  classroom_id?: string;
  school_id?: string;
  school_subject_id?: string;
  school_year_id?: string;
  day_of_week?: DayOfWeek;
  time_start?: string;
  time_end?: string;
};

@injectable()
class ListTimetablesService {
  constructor(
    @inject('TimetablesRepository')
    private timetablesRepository: ITimetablesRepository,
  ) {}

  public async execute({
    employee_id,
    classroom_id,
    school_id,
    school_subject_id,
    school_year_id,
    day_of_week,
    time_start,
    time_end,
  }: ListTimetablesRequest): Promise<Timetable[]> {
    const timetables = await this.timetablesRepository.findAll({
      employee_id,
      classroom_id,
      school_id,
      school_subject_id,
      school_year_id,
      day_of_week,
      time_start,
      time_end,
    });

    return timetables;
  }
}

export default ListTimetablesService;
