import { DayOfWeek } from '../infra/typeorm/entities/Timetable';

type CreateTimetableDTO = {
  classroom_id: string;
  school_subject_id: string;
  employee_id: string;
  day_of_week: DayOfWeek;
  time_start: string;
  time_end: string;
};

export default CreateTimetableDTO;
