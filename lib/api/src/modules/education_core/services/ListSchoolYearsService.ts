import { inject, injectable } from 'tsyringe';

import Status from '@shared/infra/typeorm/enums/Status';

import ISchoolYearsRepository from '../repositories/ISchoolYearsRepository';
import SchoolYear from '../infra/typeorm/entities/SchoolYear';

type ListSchoolYearsRequest = {
  status?: Status | Status[];
};

@injectable()
class ListSchoolYearsService {
  constructor(
    @inject('SchoolYearsRepository')
    private schoolYearsRepository: ISchoolYearsRepository,
  ) {}

  public async execute({
    status,
  }: ListSchoolYearsRequest): Promise<SchoolYear[]> {
    const schoolYears = await this.schoolYearsRepository.findAll({ status });

    return schoolYears;
  }
}

export default ListSchoolYearsService;
