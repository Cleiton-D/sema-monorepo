import { SchoolTerm } from './SchoolTerm';

export type TermPeriodStatus = 'ACTIVE' | 'FINISH' | 'PENDING';

export type SchoolTermPeriod = {
  id: string;
  school_year_id: string;
  school_term: SchoolTerm;
  date_start: string;
  date_end: string;
  status: TermPeriodStatus;
};

export type FormattedSchoolTermPeriod = SchoolTermPeriod & {
  translatedDescription: string;
  formattedDateStart: string;
  formattedDateEnd: string;
  translatedStatus: string;
};

export type SchoolTermPeriodsObject = Partial<
  Record<SchoolTerm, FormattedSchoolTermPeriod>
>;
