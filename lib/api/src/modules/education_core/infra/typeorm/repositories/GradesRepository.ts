import { getRepository, Repository } from 'typeorm';

import IGradesRepository from '@modules/education_core/repositories/IGradesRepository';
import CreateGradeDTO from '@modules/education_core/dtos/CreateGradeDTO';
import CountResultDTO from '@modules/education_core/dtos/CountResultDTO';
import Grade from '../entities/Grade';

class GradesRepository implements IGradesRepository {
  private ormRepository: Repository<Grade>;

  constructor() {
    this.ormRepository = getRepository(Grade);
  }

  public async findById(grade_id: string): Promise<Grade | undefined> {
    const grade = await this.ormRepository.findOne(grade_id);
    return grade;
  }

  public async findAll(): Promise<Grade[]> {
    const grade = await this.ormRepository.find();
    return grade;
  }

  public async findWithAfterOf(after_of: string): Promise<Grade | undefined> {
    const grade = await this.ormRepository.findOne({ after_of });
    return grade;
  }

  public async count(): Promise<CountResultDTO> {
    const count = await this.ormRepository.count();
    return { count };
  }

  public async create({
    description,
    after_of,
  }: CreateGradeDTO): Promise<Grade> {
    const grade = this.ormRepository.create({ description, after_of });
    await this.ormRepository.save(grade);

    return grade;
  }

  public async delete(grade: Grade): Promise<void> {
    await this.ormRepository.softRemove(grade);
  }
}

export default GradesRepository;
