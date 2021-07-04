import { Status } from './Status';

export type SchoolYear = {
  reference_year: string;
  date_start: string;
  date_end: string;
  status: Status;
  id: string;
};

export type FormattedSchoolYear = SchoolYear & {
  formattedDateStart: string;
  formattedDateEnd: string;
  translatedStatus: string;
};
