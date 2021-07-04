import { ClassPeriod } from './ClassPeriod';
import { Grade } from './Grade';
import { School } from './School';
import { SchoolYear } from './SchoolYear';

export type Classroom = {
  id: string;
  description: string;
  class_period_id: string;
  class_period: ClassPeriod;
  school_id: string;
  school?: School;
  grade_id: string;
  grade?: Grade;
  school_year_id: string;
  school_year?: SchoolYear;
  created_at: Date;
  updated_at: Date;
  enroll_count?: number;
};

export type ClassroomsCountResponse = {
  count: number;
};
