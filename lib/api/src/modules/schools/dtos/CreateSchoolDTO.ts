import Address from '@modules/address/infra/typeorm/entities/Address';
import Branch from '@modules/authorization/infra/typeorm/entities/Branch';
import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';

type ContactData = {
  description: string;
  type: ContactType;
};
type CreateSchoolDTO = {
  name: string;
  inep_code: string;
  director_id: string;
  vice_director_id: string;
  address: Address;
  contacts: ContactData[];
  branch: Branch;
};

export default CreateSchoolDTO;
