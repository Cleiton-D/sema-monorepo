import { Grade } from './Grade';
import { SchoolSubject } from './SchoolSubject';
import { SchoolYear } from './SchoolYear';

export type GradeSchoolSubject = {
  id: string;
  school_subject_id: string;
  school_subject?: SchoolSubject;
  grade_id: string;
  grade?: Grade;
  school_year_id: string;
  school_year?: SchoolYear;
  workload: number;
};

export type CreateGradeSchoolSubjectsRequest = {
  grade_id: string;
  school_year_id: string;
  school_subjects: Array<{
    school_subject_id: string;
    workload: number;
  }>;
};

export type UpdateGradeSchoolSubjectsRequest = {
  id: string;
  grade_id: string;
  workload: number;
};
