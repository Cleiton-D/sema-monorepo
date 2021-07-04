import { Classroom } from './Classroom';
import { Employee } from './Employee';
import { SchoolSubject } from './SchoolSubject';

export type ClassroomTeacherSchoolSubject = {
  id: string;
  classroom_id: string;
  classroom: Classroom;
  employee_id: string;
  employee: Employee;
  school_subject_id: string;
  school_subject: SchoolSubject;
  created_at: string;
  updated_at: string;
};
