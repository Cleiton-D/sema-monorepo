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
    average,
    school_term,
  }: FindSchoolReportDTO): Promise<SchoolReport[]> {
    const where: FindConditions<SchoolReport> = {};

    if (school_subject_id) where.school_subject_id = school_subject_id;
    if (average) where.average = average;
    if (school_term) where.school_term = school_term;
    if (enroll_id) {
      if (Array.isArray(enroll_id)) {
        where.enroll_id = In(enroll_id);
      } else {
        where.enroll_id = enroll_id;
      }
    }

    const schoolReports = await this.ormRepository.find({
      where,
      relations: ['school_subject', 'enroll', 'enroll.person'],
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
      ({ enroll_id, school_subject_id, school_term }) =>
        this.ormRepository.create({
          enroll_id,
          school_subject_id,
          school_term,
        }),
    );

    await this.ormRepository.save(schoolReports);
    return schoolReports;
  }
}

export default SchoolReportsRepository;
