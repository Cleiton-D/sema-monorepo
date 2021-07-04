import { Address } from './Address';
import { Person, PersonBasicFormData } from './Person';

export type Employee = {
  id: string;
  person_id: string;
  user_id: string;
  pis_pasep: string;
  education_level: string;
  created_at: string;
  updated_at: string;
  person: Person & {
    address: Address;
  };
};

export type EmployeeBasicFormData = PersonBasicFormData & {
  education_level: string;
};
