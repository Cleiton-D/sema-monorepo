import { Class, MinifiedClass } from './Class';
import { Enroll } from './Enroll';
import { EnrollClassroom } from './EnrollClassroom';
import { SchoolTerm } from './SchoolTerm';

export type Attendance = {
  id: string;
  enroll_id: string;
  enroll: Enroll;
  class_id: string;
  class: Class;
  attendance: boolean;
  justified: boolean;
  justification_description?: string;
  enroll_classroom_id: string;
  enroll_classroom: EnrollClassroom;
  created_at: string;
  updated_at: string;
};

export type AttendanceCount = {
  enroll_id: string;
  school_subject_id: string;
  school_term?: SchoolTerm;
  total: number;
  absences: number;
  attendances: number;
  attendances_percent: number;
  absences_percent: number;
};

export type MinifiedAttendance = Pick<
  Attendance,
  'id' | 'enroll_id' | 'class_id' | 'attendance' | 'enroll_classroom_id'
>;

export type ListAttendancesByClassResponseDTO = {
  classes: MinifiedClass[];
  attendances: MinifiedAttendance[];
};
