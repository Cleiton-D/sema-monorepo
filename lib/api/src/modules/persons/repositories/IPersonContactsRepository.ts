import PersonContact from '../infra/typeorm/entities/PersonContact';

export default interface IPersonContactsRepository {
  removeMany: (data: PersonContact[]) => Promise<void>;
}
