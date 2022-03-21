import { Address } from './Address';
import { Contact } from './Contact';
import { PersonBasicFormData } from './Person';

export type Employee = {
  id: string;
  name: string;
  address_id?: string;
  address: Address;
  contacts: Contact[];
  birth_date: string;
  cpf: string;
  dad_name?: string;
  mother_name: string;
  education_level: string;
  gender?: 'male' | 'female';
  pis_pasep: string;
  rg?: string;
  user_id: string;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
};

export type EmployeeBasicFormData = PersonBasicFormData & {
  education_level: string;
};
