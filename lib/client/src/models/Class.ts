import { Classroom } from './Classroom';
import { Employee } from './Employee';
import { SchoolSubject } from './SchoolSubject';

export type Class = {
  id: string;
  school_subject_id: string;
  school_subject: SchoolSubject;
  classroom_id: string;
  classroom: Classroom;
  employee_id: string;
  employee: Employee;
  status: 'PROGRESS' | 'DONE';
  taught_content: string;
  class_date: string;
  time_start: string;
  time_end?: string;
  created_at: string;
  updated_at: string;
};

export type FormattedClass = Class & {
  translatedStatus: string;
  formattedClassDate: string;
  formattedTimeStart: string;
  formattedTimeEnd?: string;
};
