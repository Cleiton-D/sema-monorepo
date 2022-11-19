import { FindOptionsWhere, In, Repository } from 'typeorm';

import { dataSource } from '@config/data_source';

import ISchoolReportsRepository from '@modules/enrolls/repositories/ISchoolReportsRepository';
import FindSchoolReportDTO from '@modules/enrolls/dtos/FindSchoolReportDTO';
import CreateSchoolReportDTO from '@modules/enrolls/dtos/CreateSchoolReportDTO';
import SchoolReport from '../entities/SchoolReport';

class SchoolReportsRepository implements ISchoolReportsRepository {
  private ormRepository: Repository<SchoolReport>;

  constructor() {
    this.ormRepository = dataSource.getRepository(SchoolReport);
  }

  public async findAll({
    enroll_id,
    school_subject_id,
  }: FindSchoolReportDTO): Promise<SchoolReport[]> {
    const where: FindOptionsWhere<SchoolReport> = {};

    if (school_subject_id) where.school_subject_id = school_subject_id;

    if (enroll_id) {
      if (Array.isArray(enroll_id)) {
        where.enroll_id = In(enroll_id);
      } else {
        where.enroll_id = enroll_id;
      }
    }

    // relations: ['school_subject', 'enroll', 'enroll.student'],

    const queryBuilder = this.ormRepository
      .createQueryBuilder('school_report')
      .select()
      .where(where)
      .innerJoinAndSelect('school_report.school_subject', 'school_subject')
      .innerJoinAndSelect('school_report.enroll', 'enroll')
      .innerJoinAndSelect('enroll.student', 'student')
      .leftJoinAndSelect('enroll.enroll_classrooms', 'enroll_classroom')
      .leftJoinAndSelect('enroll_classroom.classroom', 'current_classroom')
      .addOrderBy('student.name');

    const schoolReports = await queryBuilder.getMany();

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
        annual_average,
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
          annual_average,
        }),
    );

    await this.ormRepository.save(schoolReports);
    return schoolReports;
  }
}

export default SchoolReportsRepository;
