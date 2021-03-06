import { Address, AddressFormData } from './Address';
import { Contact } from './Contact';
import { PersonDocument } from './PersonDocuments';

export type Person = {
  id: string;
  name: string;
  mother_name: string;
  dad_name?: string;
  gender?: 'male' | 'female';
  address_id: string;
  address?: Address;
  birth_date: string;
  created_at: string;
  updated_at: string;
  documents?: PersonDocument[];
  contacts: Contact[];
};

export type PersonBasicFormData = {
  name: string;
  gender?: 'male' | 'female';
  birth_date: string;
  mother_name: string;
  dad_name?: string;
  address: AddressFormData;
};
