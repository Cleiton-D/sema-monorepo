import { ClassPeriod } from './ClassPeriod';
import { School } from './School';
import { SchoolYear } from './SchoolYear';

export type SchoolClassPeriod = {
  id: string;
  school_id: string;
  school?: School;
  class_period_id: string;
  class_period?: ClassPeriod;
  school_year_id: string;
  school_year?: SchoolYear;
};

export type DefineSchoolClassPeriodRequest = {
  school_id: string;
  school_year_id: string;
  class_periods: Array<'MORNING' | 'EVENING' | 'NOCTURNAL'>;
};
