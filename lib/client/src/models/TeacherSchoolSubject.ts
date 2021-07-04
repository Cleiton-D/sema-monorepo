import { Employee } from './Employee';

export type TeacherSchoolSubject = {
  id: string;
  school_id: string;
  school_subject_id: string;
  employee: Employee;
  employee_id: string;
  created_at: string;
  updated_at: string;
};
