import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Class from '../infra/typeorm/entities/Class';
import IClassesRepository from '../repositories/IClassesRepository';

type FinishClassRequest = {
  class_id: string;
};

@injectable()
class FinishClassService {
  constructor(
    @inject('ClassesRepository') private classesRepository: IClassesRepository,
  ) {}

  public async execute({ class_id }: FinishClassRequest): Promise<Class> {
    const classEntity = await this.classesRepository.findById(class_id);
    if (!classEntity) {
      throw new AppError('Class not found');
    }

    const newClass = Object.assign(classEntity, {
      status: 'DONE',
      date_end: new Date(),
    });
    return this.classesRepository.update(newClass);
  }
}

export default FinishClassService;
