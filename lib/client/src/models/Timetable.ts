import { Classroom } from './Classroom';
import { DayOfWeek } from './DafOfWeek';
import { Employee } from './Employee';
import { SchoolSubject } from './SchoolSubject';

export type Timetable = {
  id: string;
  classroom_id: string;
  classroom?: Classroom;
  day_of_week: DayOfWeek;
  employee_id: string;
  employee?: Employee;
  school_subject_id: string;
  school_subject?: SchoolSubject;
  time_end: string;
  time_start: string;
  created_at: string;
  updated_at: string;
};
