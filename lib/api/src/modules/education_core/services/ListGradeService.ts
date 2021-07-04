import { inject, injectable } from 'tsyringe';
import Grade from '../infra/typeorm/entities/Grade';
import IGradesRepository from '../repositories/IGradesRepository';

@injectable()
class ListGradeService {
  constructor(
    @inject('GradesRepository') private gradesRepository: IGradesRepository,
  ) {}

  public async execute(): Promise<Grade[]> {
    const grade = await this.gradesRepository.findAll();
    return grade;
  }
}

export default ListGradeService;
