import { Enroll } from './Enroll';
import { SchoolSubject } from './SchoolSubject';
import { SchoolTerm } from './SchoolTerm';

export type SchoolReport = {
  id: string;
  enroll_id: string;
  enroll: Enroll;
  school_subject_id: string;
  school_subject: SchoolSubject;
  first?: number;
  second?: number;
  first_rec?: number;
  third?: number;
  fourth?: number;
  second_rec?: number;
  exam?: number;
  final_average?: number;
  annual_average?: number;
  created_at: string;
  updated_at: string;
};

export type MappedAttendanceSchoolSubject = Record<
  `attendances-${SchoolTerm}`,
  number
> & {
  school_subject: string;
};

export type MappedSchoolReportSubject = Record<SchoolTerm, string | number> & {
  school_subject: string;
  finalAverage: number | string;
  annualAverage: number | string;
};

export type MappedSchoolReport = SchoolReport & {
  formattedAverages: Record<string, number | string>;
};

export type MappedSchoolReportSubjectWithAttendances =
  MappedSchoolReportSubject &
    Record<`attendances-${SchoolTerm}`, number> & {
      totalAttendances: number;
    };
