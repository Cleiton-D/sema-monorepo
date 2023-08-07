import { DayOfWeek } from '../infra/typeorm/entities/Timetable';

type FindTimetableDTO = {
  id?: string[];
  employee_id?: string;
  classroom_id?: string;
  school_id?: string;
  school_subject_id?: string;
  school_year_id?: string;
  day_of_week?: DayOfWeek;
  time_start?: string;
  time_end?: string;
};

export default FindTimetableDTO;
