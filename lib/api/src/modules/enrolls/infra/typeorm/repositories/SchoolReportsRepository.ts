import { FindConditions, getRepository, In, Repository } from 'typeorm';

import ISchoolReportsRepository from '@modules/enrolls/repositories/ISchoolReportsRepository';
import FindSchoolReportDTO from '@modules/enrolls/dtos/FindSchoolReportDTO';
import CreateSchoolReportDTO from '@modules/enrolls/dtos/CreateSchoolReportDTO';
import SchoolReport from '../entities/SchoolReport';

class SchoolReportsRepository implements ISchoolReportsRepository {
  private ormRepository: Repository<SchoolReport>;

  constructor() {
    this.ormRepository = getRepository(SchoolReport);
  }

  public async findAll({
    enroll_id,
    school_subject_id,
  }: FindSchoolReportDTO): Promise<SchoolReport[]> {
    const where: FindConditions<SchoolReport> = {};

    if (school_subject_id) where.school_subject_id = school_subject_id;

    if (enroll_id) {
      if (Array.isArray(enroll_id)) {
        where.enroll_id = In(enroll_id);
      } else {
        where.enroll_id = enroll_id;
      }
    }

    const schoolReports = await this.ormRepository.find({
      where,
      relations: ['school_subject', 'enroll', 'enroll.student'],
    });

    return schoolReports;
  }

  public async updateMany(
    schoolReports: SchoolReport[],
  ): Promise<SchoolReport[]> {
    await this.ormRepository.save(schoolReports);
    return schoolReports;
  }

  public async createMany(
    data: CreateSchoolReportDTO[],
  ): Promise<SchoolReport[]> {
    const schoolReports = data.map(
      ({
        enroll_id,
        school_subject_id,
        first,
        second,
        first_rec,
        third,
        fourth,
        second_rec,
        exam,
        final_average,
      }) =>
        this.ormRepository.create({
          enroll_id,
          school_subject_id,
          first,
          second,
          first_rec,
          third,
          fourth,
          second_rec,
          exam,
          final_average,
        }),
    );

    await this.ormRepository.save(schoolReports);
    return schoolReports;
  }
}

export default SchoolReportsRepository;
