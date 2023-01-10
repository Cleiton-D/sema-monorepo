import Grade from '../infra/typeorm/entities/Grade';

import CountResultDTO from '../dtos/CountResultDTO';
import CreateGradeDTO from '../dtos/CreateGradeDTO';
import FindGradeDTO from '../dtos/FindGradeDTO';

export default interface IGradesRepository {
  findById: (grade_id: string) => Promise<Grade | undefined>;
  findAll: (filters?: FindGradeDTO) => Promise<Grade[]>;
  findWithAfterOf: (after_of: string) => Promise<Grade | undefined>;
  count: (filters?: FindGradeDTO) => Promise<CountResultDTO>;
  create: (data: CreateGradeDTO) => Promise<Grade>;
  delete: (user: Grade) => Promise<void>;
}
