import Address from '@modules/address/infra/typeorm/entities/Address';
import { ContactType } from '@modules/contacts/infra/typeorm/entities/Contact';
import { Gender } from '@modules/persons/infra/typeorm/entities/Person';
import { DocumentType } from '../infra/typeorm/entities/PersonDocument';

type ContactData = {
  description: string;
  type: ContactType;
};

type DocumentData = {
  document_number: string;
  document_type: DocumentType;
};

type CreatePersonDTO = {
  name: string;
  mother_name?: string;
  dad_name?: string;
  gender?: Gender;
  birth_date?: Date;
  address?: Address;
  documents: DocumentData[];
  contacts: ContactData[];
};

export default CreatePersonDTO;
