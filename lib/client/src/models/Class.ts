import { Classroom } from './Classroom';
import { Employee } from './Employee';
import { SchoolSubject } from './SchoolSubject';
import { SchoolTerm } from './SchoolTerm';

export type Class = {
  id: string;
  school_subject_id: string;
  school_subject: SchoolSubject;
  classroom_id: string;
  classroom: Classroom;
  employee_id: string;
  employee: Employee;
  status: 'PROGRESS' | 'DONE';
  school_term: SchoolTerm;
  taught_content: string;
  class_date: string;
  date_start: string;
  date_end?: string;
  period: string;
  created_at: string;
  updated_at: string;
};

export type FormattedClass = Class & {
  translatedStatus: string;
  formattedClassDate: string;
  // formattedTimeStart: string;
  // formattedTimeEnd?: string;
};
