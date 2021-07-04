import { inject, injectable } from 'tsyringe';

import CreateSchoolReportDTO from '../dtos/CreateSchoolReportDTO';
import SchoolReport from '../infra/typeorm/entities/SchoolReport';
import ISchoolReportsRepository from '../repositories/ISchoolReportsRepository';

type CreateSchoolReportsToEnrollRequest = {
  enroll_id: string | string[];
  school_subject_id: string | string[];
};

@injectable()
class CreateSchoolReportsToEnrollService {
  constructor(
    @inject('SchoolReportsRepository')
    private schoolReportsRepository: ISchoolReportsRepository,
  ) {}

  public async execute({
    enroll_id,
    school_subject_id,
  }: CreateSchoolReportsToEnrollRequest): Promise<SchoolReport[]> {
    const enrolls = Array.isArray(enroll_id) ? enroll_id : Array.of(enroll_id);
    const schoolSubjects = Array.isArray(school_subject_id)
      ? school_subject_id
      : Array.of(school_subject_id);

    const createSchoolReportsData = enrolls.reduce<CreateSchoolReportDTO[]>(
      (acc, enroll) => {
        const items = schoolSubjects.reduce<CreateSchoolReportDTO[]>(
          (subjectAcc, schoolSubject) => {
            const common = {
              enroll_id: enroll,
              school_subject_id: schoolSubject,
            };

            const first: CreateSchoolReportDTO = {
              ...common,
              school_term: 'FIRST',
            };
            const second: CreateSchoolReportDTO = {
              ...common,
              school_term: 'SECOND',
            };
            const third: CreateSchoolReportDTO = {
              ...common,
              school_term: 'THIRD',
            };
            const fourth: CreateSchoolReportDTO = {
              ...common,
              school_term: 'FOURTH',
            };

            return [...subjectAcc, first, second, third, fourth];
          },
          [],
        );

        return [...acc, ...items];
      },
      [],
    );

    const schoolReports = await this.schoolReportsRepository.createMany(
      createSchoolReportsData,
    );
    return schoolReports;
  }
}

export default CreateSchoolReportsToEnrollService;
