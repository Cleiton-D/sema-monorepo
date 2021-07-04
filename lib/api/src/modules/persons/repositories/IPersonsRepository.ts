import CreatePersonDTO from '../dtos/CreatePersonDTO';
import Person from '../infra/typeorm/entities/Person';

export default interface IPersonsRepository {
  findById: (person_id: string) => Promise<Person | undefined>;
  create: (data: CreatePersonDTO) => Promise<Person>;
  update: (date: Person) => Promise<Person>;
}
