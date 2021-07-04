import { inject, injectable } from 'tsyringe';

import SchoolReport from '../infra/typeorm/entities/SchoolReport';
import ISchoolReportsRepository from '../repositories/ISchoolReportsRepository';
import IEnrollClassroomsRepository from '../repositories/IEnrollClassroomsRepository';

type ListEnrollSchoolReportsRequest = {
  enroll_id?: string;
  classroom_id?: string;
  school_subject_id?: string;
};

@injectable()
class ListEnrollSchoolReportsService {
  constructor(
    @inject('SchoolReportsRepository')
    private schoolReportsRepository: ISchoolReportsRepository,
    @inject('EnrollClassroomsRepository')
    private enrollClassroomsRepository: IEnrollClassroomsRepository,
  ) {}

  public async execute({
    enroll_id,
    classroom_id,
    school_subject_id,
  }: ListEnrollSchoolReportsRequest): Promise<SchoolReport[]> {
    const enrollId =
      !enroll_id && classroom_id
        ? await this.getEnrolls({ classroom_id })
        : enroll_id;

    const schoolReports = await this.schoolReportsRepository.findAll({
      enroll_id: enrollId,
      school_subject_id,
    });

    return schoolReports;
  }

  private async getEnrolls({
    classroom_id,
  }: Pick<ListEnrollSchoolReportsRequest, 'classroom_id'>): Promise<string[]> {
    const enrollClassrooms = await this.enrollClassroomsRepository.findAll({
      classroom_id,
      status: 'ACTIVE',
    });

    return enrollClassrooms.map(({ enroll_id }) => enroll_id);
  }
}

export default ListEnrollSchoolReportsService;
