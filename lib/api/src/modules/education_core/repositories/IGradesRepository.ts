import CountResultDTO from '../dtos/CountResultDTO';
import CreateGradeDTO from '../dtos/CreateGradeDTO';
import Grade from '../infra/typeorm/entities/Grade';

export default interface IGradesRepository {
  findById: (grade_id: string) => Promise<Grade | undefined>;
  findAll: () => Promise<Grade[]>;
  findWithAfterOf: (after_of: string) => Promise<Grade | undefined>;
  count: () => Promise<CountResultDTO>;
  create: (data: CreateGradeDTO) => Promise<Grade>;
  delete: (user: Grade) => Promise<void>;
}
