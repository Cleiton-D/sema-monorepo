import { inject, injectable } from 'tsyringe';

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';

import AppError from '@shared/errors/AppError';

import IClassesRepository from '../repositories/IClassesRepository';

type DeleteClassRequest = {
  user_id: string;
  class_id: string;
};

@injectable()
class DeleteClassService {
  constructor(
    @inject('ClassesRepository') private classesRepository: IClassesRepository,
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
  ) {}

  public async execute({
    user_id,
    class_id,
  }: DeleteClassRequest): Promise<void> {
    const employee = await this.employeesRepository.findOne({ user_id });
    if (!employee) {
      throw new AppError('You cannot register an class');
    }

    const classEntity = await this.classesRepository.findOne({ id: class_id });
    if (!classEntity) {
      throw new AppError('Class not found');
    }

    await this.classesRepository.delete(classEntity);
  }
}

export default DeleteClassService;
