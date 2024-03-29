import { ClassPeriod } from './ClassPeriod';
import { Classroom } from './Classroom';
import { Grade } from './Grade';
import { School } from './School';
import { Student, StudentForm } from './Student';

export type EnrollStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'TRANSFERRED'
  | 'QUITTER'
  | 'DECEASED'
  | 'APPROVED'
  | 'DISAPPROVED';

export type Enroll = {
  id: string;
  status: EnrollStatus | string;
  student_id: string;
  school_id: string;
  school?: School;
  grade_id: string;
  grade?: Grade;
  school_year_id: string;
  created_at: string;
  updated_at: string;
  student: Student;
  current_classroom?: Classroom;
  class_period?: ClassPeriod;
  enroll_date: string;
  origin: 'NEW' | 'REPEATING';
  unique_code: string;
  transfer_date?: string;
};

export type EnrollCountResponse = {
  count: number;
};

export type EnrollFormData = {
  origin: 'NEW' | 'REPEATING';
  grade_id: string;
  // class_period: ClassPeriod;

  classroom_id: string;
  enroll_date: string;
  schoolReports: Record<string, Record<string, number>>;
};

export type EnrollDocumentsFormData = {
  cpf?: string;
  rg?: string;
  nis?: string;
  birth_certificate?: string;
  unique_code?: string;
};

export type CompleteEnrollFormData = EnrollFormData & {
  student: StudentForm;
};

export type MappedEnroll = Enroll & {
  formattedGender?: string;
  formattedBirthDate?: string;
  formattedStatus?: string;
  formattedCreatedAt?: string;
  formattedEnrollDate?: string;
  studentAge?: string | number;
};
