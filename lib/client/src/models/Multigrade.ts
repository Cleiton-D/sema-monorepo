import { Classroom } from './Classroom';

export type Multigrade = Classroom & {
  classrooms?: Classroom[];
};
