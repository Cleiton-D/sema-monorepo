import { SchoolTerm } from './SchoolTerm';

export type SchoolTermPeriod = {
  id: string;
  school_year_id: string;
  school_term: SchoolTerm;
  date_start: string;
  date_end: string;
};

export type FormattedSchoolTermPeriod = SchoolTermPeriod & {
  formattedDateStart: string;
  formattedDateEnd: string;
};

export type SchoolTermPeriodsObject = Partial<
  Record<SchoolTerm, FormattedSchoolTermPeriod>
>;
