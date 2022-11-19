import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Class from '../infra/typeorm/entities/Class';
import IClassesRepository from '../repositories/IClassesRepository';

type ShowClassRequest = {
  class_id: string;
};

@injectable()
class ShowClassService {
  constructor(
    @inject('ClassesRepository') private classesRepository: IClassesRepository,
  ) {}

  public async execute({ class_id }: ShowClassRequest): Promise<Class> {
    const classEntity = await this.classesRepository.findOne({ id: class_id });
    if (!classEntity) {
      throw new AppError('Class not found.');
    }

    return classEntity;
  }
}

export default ShowClassService;
