import { ContactType } from '../infra/typeorm/entities/Contact';

type CreateContactDTO = {
  description: string;
  type: ContactType;
};

export default CreateContactDTO;
