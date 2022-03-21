import { Classroom } from './Classroom';

export type MultigradeClassroom = {
  id: string;
  owner_id?: string;
  classroom: Classroom;
};
