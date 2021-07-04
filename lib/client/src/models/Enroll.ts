import { Classroom } from './Classroom';
import { ContactFormData } from './Contact';
import { Grade } from './Grade';
import { Person, PersonBasicFormData } from './Person';
import { Status } from './Status';

export type Enroll = {
  id: string;
  status: Status;
  person_id: string;
  school_id: string;
  grade_id: string;
  grade?: Grade;
  school_year_id: string;
  created_at: string;
  updated_at: string;
  person: Person;
  current_classroom: Classroom;
};

export type EnrollCountResponse = {
  count: number;
};

export type EnrollFormData = {
  grade_id: string;
  class_period_id: string;
  classroom_id: string;
};

export type CompleteEnrollFormData = EnrollFormData & {
  person: PersonBasicFormData & {
    contacts: ContactFormData[];
  };
};
