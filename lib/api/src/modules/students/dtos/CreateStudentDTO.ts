import Person from '@modules/persons/infra/typeorm/entities/Person';

type CreateStudentDTO = {
  person: Person;
};

export default CreateStudentDTO;
