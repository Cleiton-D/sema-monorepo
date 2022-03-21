import { Classroom } from './Classroom';
import { Enroll } from './Enroll';

export type EnrollClassroom = {
  id: string;
  status: string;
  classroom_id: string;
  enroll_id: string;
  classroom: Classroom;
  enroll: Enroll;
};
