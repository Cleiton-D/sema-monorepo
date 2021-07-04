import CreateSchoolClassPeriodDTO from '../dtos/CreateSchoolClassPeriodDTO';
import FindSchoolClassPeriodDTO from '../dtos/FindSchoolClassPeriodDTO';
import GetSchoolClassPeriodDTO from '../dtos/GetSchoolClassPeriodDTO';
import SchoolClassPeriod from '../infra/typeorm/entities/SchoolClassPeriod';

export default interface ISchoolClassPeriodsRepository {
  find: (filters: FindSchoolClassPeriodDTO) => Promise<SchoolClassPeriod[]>;
  getOne: (
    filters: GetSchoolClassPeriodDTO,
  ) => Promise<SchoolClassPeriod | undefined>;
  createMany: (
    data: CreateSchoolClassPeriodDTO[],
  ) => Promise<SchoolClassPeriod[]>;
  updateMany: (
    schoolClassPeriods: SchoolClassPeriod[],
  ) => Promise<SchoolClassPeriod[]>;
  deleteMany: (schoolClassPeriods: SchoolClassPeriod[]) => Promise<void>;
}
