import { inject, injectable } from 'tsyringe';

import SchoolReport from '../infra/typeorm/entities/SchoolReport';
import ISchoolReportsRepository from '../repositories/ISchoolReportsRepository';
import IEnrollClassroomsRepository from '../repositories/IEnrollClassroomsRepository';
import IEnrollsRepository from '../repositories/IEnrollsRepository';
import Enroll from '../infra/typeorm/entities/Enroll';

type ListEnrollSchoolReportsRequest = {
  enroll_id?: string;
  classroom_id?: string;
  school_subject_id?: string;
  school_year_id?: string;
  student_id?: string;
  enroll_as?: 'all' | 'last' | 'first';
  grade_id?: string;
};

@injectable()
class ListEnrollSchoolReportsService {
  constructor(
    @inject('SchoolReportsRepository')
    private schoolReportsRepository: ISchoolReportsRepository,
    @inject('EnrollClassroomsRepository')
    private enrollClassroomsRepository: IEnrollClassroomsRepository,
    @inject('EnrollsRepository')
    private enrollsRepository: IEnrollsRepository,
  ) {}

  public async execute({
    enroll_id,
    classroom_id,
    school_subject_id,
    school_year_id,
    student_id,
    grade_id,
    enroll_as,
  }: ListEnrollSchoolReportsRequest): Promise<SchoolReport[]> {
    const enrollId = await this.getEnrolls({
      enroll_id,
      classroom_id,
      school_year_id,
      student_id,
      grade_id,
      enroll_as,
    });

    const schoolReports = await this.schoolReportsRepository.findAll({
      enroll_id: enrollId,
      school_subject_id,
      school_year_id,
      student_id,
      enroll_as,
    });

    return schoolReports;
  }

  private async getEnrolls({
    enroll_id,
    classroom_id,
    school_year_id,
    student_id,
    grade_id,
    enroll_as,
  }: ListEnrollSchoolReportsRequest): Promise<string[]> {
    if (enroll_id) return Array.of(enroll_id);

    let enrolls: Enroll[] = [];
    if (school_year_id || student_id || grade_id) {
      if (enroll_as && enroll_as !== 'all') {
        const orderObj = {
          last: 'desc',
          first: 'asc',
        };

        const enroll = await this.enrollsRepository.findOne({
          student_id,
          school_year_id,
          grade_id,
          order: [`created_at(${orderObj[enroll_as]})`],
        });
        if (enroll) enrolls = Array.of(enroll);
      } else {
        enrolls = await this.enrollsRepository.findAll({
          student_id,
          grade_id,
          school_year_id,
        });
      }
    }

    const enrollIds = enrolls.map(({ id }) => id);
    if (!classroom_id) return enrollIds;

    const enrollClassrooms = await this.enrollClassroomsRepository.findAll({
      classroom_id,
      enroll_id: enrollIds.length > 0 ? enrollIds : undefined,
      // status: 'ACTIVE',
    });

    return enrollClassrooms.map(({ enroll_id: enrollId }) => enrollId);
  }
}

export default ListEnrollSchoolReportsService;
