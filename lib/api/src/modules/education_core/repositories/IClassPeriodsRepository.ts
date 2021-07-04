import CreateClassPeriodDTO from '../dtos/CreateClassPeriodDTO';
import FindClassPeriodsFiltersDTO from '../dtos/FindClassPeriodFiltersDTO';
import ClassPeriod from '../infra/typeorm/entities/ClassPeriod';

export default interface IClassPeriodsRepository {
  findOne: (
    filters: FindClassPeriodsFiltersDTO,
  ) => Promise<ClassPeriod | undefined>;
  findBySchoolYear: (school_year_id: string) => Promise<ClassPeriod[]>;
  findAll: (filters: FindClassPeriodsFiltersDTO) => Promise<ClassPeriod[]>;
  createMany: (data: CreateClassPeriodDTO[]) => Promise<ClassPeriod[]>;
  updateMany: (data: ClassPeriod[]) => Promise<ClassPeriod[]>;
  delete: (classPeriod: ClassPeriod) => Promise<void>;
}
