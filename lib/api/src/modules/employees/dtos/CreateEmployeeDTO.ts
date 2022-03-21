import Address from '@modules/address/infra/typeorm/entities/Address';
import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import User from '@modules/users/infra/typeorm/entities/User';

import { Gender } from '@shared/infra/typeorm/enums/Gender';

type ContactData = {
  description: string;
  type: ContactType;
};

type CreateEmployeeDTO = {
  name: string;
  mother_name?: string;
  dad_name?: string;
  gender?: Gender;
  birth_date?: Date;
  address?: Address;
  contacts: ContactData[];
  user: User;
  education_level: string;
  pis_pasep: string;
  cpf: string;
  rg?: string;
};

export default CreateEmployeeDTO;
