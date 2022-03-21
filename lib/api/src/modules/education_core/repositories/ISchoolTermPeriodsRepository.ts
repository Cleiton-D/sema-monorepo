import CreateSchoolTermPeriodDTO from '../dtos/CreateSchoolTermPeriodDTO';
import FindSchoolTermPeriodDTO from '../dtos/FindSchoolTermPeriodDTO';
import SchoolTermPeriod from '../infra/typeorm/entities/SchoolTermPeriod';

export default interface ISchoolTermPeriodsRepository {
  findOne: (
    filters: FindSchoolTermPeriodDTO,
  ) => Promise<SchoolTermPeriod | undefined>;
  findAll: (filters: FindSchoolTermPeriodDTO) => Promise<SchoolTermPeriod[]>;
  createMany: (
    items: CreateSchoolTermPeriodDTO[],
  ) => Promise<SchoolTermPeriod[]>;
  updateMany: (items: SchoolTermPeriod[]) => Promise<SchoolTermPeriod[]>;
}
