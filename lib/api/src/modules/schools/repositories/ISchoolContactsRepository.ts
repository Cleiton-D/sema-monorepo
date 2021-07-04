import FindSchoolContactDTO from '../dtos/FindSchoolContactDTO';
import SchoolContact from '../infra/typeorm/entities/SchoolContact';

export default interface ISchoolContactsRepository {
  findAll: (filters: FindSchoolContactDTO) => Promise<SchoolContact[]>;
}
