import { Class } from './Class';
import { Enroll } from './Enroll';

export type Attendance = {
  id: string;
  enroll_id: string;
  enroll: Enroll;
  class_id: string;
  class: Class;
  attendance: boolean;
  justified: boolean;
  justification_description?: string;
  created_at: string;
  updated_at: string;
};
