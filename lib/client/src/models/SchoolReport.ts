import { Enroll } from './Enroll';
import { SchoolSubject } from './SchoolSubject';
import { SchoolTerm } from './SchoolTerm';

export type SchoolReport = {
  id: string;
  enroll_id: string;
  enroll: Enroll;
  average: number | null;
  school_term: SchoolTerm;
  school_subject_id: string;
  school_subject: SchoolSubject;
  created_at: string;
  updated_at: string;
};

export type MappedSchoolReportSubject = Record<SchoolTerm, string> & {
  school_subject: string;
};

export type MappedSchoolReportEnroll = Record<SchoolTerm, string> & {
  enroll: Enroll;
};
