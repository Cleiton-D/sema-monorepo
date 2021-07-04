import { Address } from './Address';
import { Contact } from './Contact';
import { Employee } from './Employee';

export type School = {
  id: string;
  name: string;
  inep_code: string;
  address_id: string;
  branch_id: string;
  created_at: string;
  contacts: Contact[];
  address: Address;
  director_id: string;
  director: Employee;
  vice_director_id: string;
  vice_director: Employee;
};

export type CompleteSchool = School & {
  enroll_count: number;
  classrooms_count: number;
};

export type SchoolWithEnrollCount = Omit<School, 'address' | 'contacts'> & {
  enroll_count: string | number;
};

export type SchoolContact = {
  id: string;
  school_id: string;
  contact_id: string;
  created_at: string;
  updated_at: string;
};

export type BasicSchoolFormType = {
  name: string;
  inep_code: string;
  director_id: Employee;
  vice_director_id: Employee;
};
