import CreateSchoolYearDTO from '../dtos/CreateSchoolYearDTO';
import FindSchollYearByPeriodDTO from '../dtos/FindSchollYearByPeriodDTO';
import SchoolYear from '../infra/typeorm/entities/SchoolYear';

export default interface ISchoolYearsRepository {
  findById: (school_year_id: string) => Promise<SchoolYear | undefined>;
  findByReferenceYear: (
    referenceYear: string,
  ) => Promise<SchoolYear | undefined>;
  findByPeriod: (
    data: FindSchollYearByPeriodDTO,
  ) => Promise<SchoolYear | undefined>;
  findLast: () => Promise<SchoolYear | undefined>;
  getCurrent: () => Promise<SchoolYear | undefined>;
  create: (data: CreateSchoolYearDTO) => Promise<SchoolYear>;
  update: (schoolYear: SchoolYear) => Promise<SchoolYear>;
}
