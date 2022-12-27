import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import MedicalCertificate from '../infra/typeorm/entities/MedicalCertificate';
import IEnrollsRepository from '../repositories/IEnrollsRepository';
import IMedicalCertificatesRepository from '../repositories/IMedicalCertificatesRepository';

type CreateMedicalCertificateRequest = {
  enroll_id: string;
  date_start: Date;
  date_end: Date;
  description: string;
};

@injectable()
class CreateMedicalCertificateService {
  constructor(
    @inject('EnrollsRepository') private enrollsRepository: IEnrollsRepository,
    @inject('MedicalCertificatesRepository')
    private medicalCertificatesRepository: IMedicalCertificatesRepository,
  ) {}

  public async execute({
    enroll_id,
    date_start,
    date_end,
    description,
  }: CreateMedicalCertificateRequest): Promise<MedicalCertificate> {
    const enroll = await this.enrollsRepository.findOne({ id: enroll_id });
    if (!enroll) {
      throw new AppError('Enroll not found');
    }

    const medicalCertificate = await this.medicalCertificatesRepository.create({
      enroll_id: enroll.id,
      date_start,
      date_end,
      description,
    });

    return medicalCertificate;
  }
}

export default CreateMedicalCertificateService;
