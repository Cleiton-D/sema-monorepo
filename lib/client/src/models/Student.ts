import { Address, AddressFormData } from './Address';
import { Contact } from './Contact';

export type Student = {
  id: string;
  name: string;
  mother_name: string;
  dad_name?: string;
  gender?: 'male' | 'female';
  address_id: string;
  address: Address;
  birth_date?: Date;
  cpf?: string;
  rg?: string;
  nis?: string;
  birth_certificate?: string;
  contacts: Contact[];
  breed: string;
  naturalness: string;
  naturalness_uf: string;
  identity_document: string;
  unique_code: string;
  nationality: string;
  created_at: Date;
  updated_at: Date;
};

export type StudentForm = {
  name: string;
  gender?: 'male' | 'female';
  birth_date: string;
  mother_name: string;
  dad_name?: string;
  address: AddressFormData;
  breed: string;
  naturalness: string;
  naturalness_uf: string;
  identity_document: string;
  nationality: string;
};
