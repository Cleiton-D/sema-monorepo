import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IEnrollsRepository from '../repositories/IEnrollsRepository';
import ISchoolReportsRepository from '../repositories/ISchoolReportsRepository';
import SchoolReport from '../infra/typeorm/entities/SchoolReport';
import { EnrollStatus } from '../infra/typeorm/entities/Enroll';

type UpdateEnrollStatusRequest = {
  enroll_id: string;
};

@injectable()
class UpdateEnrollStatusService {
  constructor(
    @inject('EnrollsRepository') private enrollsRepository: IEnrollsRepository,
    @inject('SchoolReportsRepository')
    private schoolReportsRepository: ISchoolReportsRepository,
  ) {}

  private getStatus(schoolReports: SchoolReport[]): EnrollStatus {
    const statusSet = new Set(schoolReports.map(({ status }) => status));

    if (statusSet.has('DISAPPROVED_FOR_ABSENCES')) {
      return 'DISAPPROVED_FOR_ABSENCES';
    }

    if (statusSet.has('DISAPPROVED')) return 'DISAPPROVED';

    if (schoolReports.every(({ status }) => status === 'APPROVED')) {
      return 'APPROVED';
    }

    return 'ACTIVE';
  }

  public async execute({
    enroll_id,
  }: UpdateEnrollStatusRequest): Promise<void> {
    const enroll = await this.enrollsRepository.findOne({
      id: enroll_id,
    });
    if (!enroll) {
      throw new AppError('Enroll not found');
    }
    const invalidStatus = ['INACTIVE', 'TRANSFERRED', 'QUITTER', 'DECEASED'];
    if (invalidStatus.includes(enroll.status)) return;

    const schoolReports = await this.schoolReportsRepository.findAll({
      enroll_id,
    });

    const status = this.getStatus(schoolReports);
    const newEnroll = Object.assign(enroll, { status });

    await this.enrollsRepository.update(newEnroll);
  }
}

export default UpdateEnrollStatusService;
