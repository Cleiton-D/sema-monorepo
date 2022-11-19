import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import SchoolTermPeriod, {
  TermPeriodStatus,
} from '../infra/typeorm/entities/SchoolTermPeriod';

import ISchoolTermPeriodsRepository from '../repositories/ISchoolTermPeriodsRepository';

type UpdateSchoolTermPeriodRequest = {
  id: string;
  date_start?: Date;
  date_end?: Date;
  status?: TermPeriodStatus;
  manually_changed?: boolean;
};

@injectable()
class UpdateSchoolTermPeriodService {
  constructor(
    @inject('SchoolTermPeriodsRepository')
    private schoolTermPeriodsRepository: ISchoolTermPeriodsRepository,
  ) {}

  public async execute({
    id,
    date_start,
    date_end,
    status,
    manually_changed,
  }: UpdateSchoolTermPeriodRequest): Promise<SchoolTermPeriod> {
    const schoolTermPeriod = await this.schoolTermPeriodsRepository.findOne({
      id,
    });
    if (!schoolTermPeriod) {
      throw new AppError('School Term period not found', 404);
    }

    if (date_start) {
      schoolTermPeriod.date_start = date_start;
    }
    if (date_end) {
      schoolTermPeriod.date_end = date_end;
    }
    if (status) {
      schoolTermPeriod.status = status;
    }
    if (typeof manually_changed !== 'undefined') {
      schoolTermPeriod.manually_changed = manually_changed;
    }

    await this.schoolTermPeriodsRepository.updateMany([schoolTermPeriod]);
    return schoolTermPeriod;
  }
}

export default UpdateSchoolTermPeriodService;
