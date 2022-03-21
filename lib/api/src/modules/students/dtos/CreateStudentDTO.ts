import Address from '@modules/address/infra/typeorm/entities/Address';
import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';

import { Gender } from '@shared/infra/typeorm/enums/Gender';

type ContactData = {
  description: string;
  type: ContactType;
};

type CreateStudentDTO = {
  name: string;
  mother_name: string;
  dad_name?: string;
  gender: Gender;
  address?: Address;
  birth_date: string;
  cpf?: string;
  rg?: string;
  nis?: string;
  birth_certificate?: string;
  breed: string;
  naturalness: string;
  naturalness_uf: string;
  identity_document: string;
  nationality: string;
  unique_code: string;
  contacts: ContactData[];
};

export default CreateStudentDTO;
