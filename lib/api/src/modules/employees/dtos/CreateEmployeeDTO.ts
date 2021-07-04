import Person from '@modules/persons/infra/typeorm/entities/Person';
import User from '@modules/users/infra/typeorm/entities/User';

type CreateEmployeeDTO = {
  person: Person;
  user: User;
  pis_pasep: string;
  education_level: string;
};

export default CreateEmployeeDTO;
