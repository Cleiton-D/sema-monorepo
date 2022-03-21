import { inject, injectable } from 'tsyringe';

import CreateSchoolReportDTO from '../dtos/CreateSchoolReportDTO';
import SchoolReport from '../infra/typeorm/entities/SchoolReport';
import ISchoolReportsRepository from '../repositories/ISchoolReportsRepository';

type CreateSchoolReportsToEnrollRequest = {
  enroll_id: string | string[];
  school_subject_id: string | string[];
  reports?: Record<string, Record<string, number>>;
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
    reports,
  }: CreateSchoolReportsToEnrollRequest): Promise<SchoolReport[]> {
    const enrolls = Array.isArray(enroll_id) ? enroll_id : Array.of(enroll_id);
    const schoolSubjects = Array.isArray(school_subject_id)
      ? school_subject_id
      : Array.of(school_subject_id);

    const createSchoolReportsData = enrolls.reduce<CreateSchoolReportDTO[]>(
      (acc, enroll) => {
        const items = schoolSubjects.reduce<CreateSchoolReportDTO[]>(
          (subjectAcc, schoolSubject) => {
            const existentReports = reports ? reports[schoolSubject] || {} : {};

            const common = {
              enroll_id: enroll,
              school_subject_id: schoolSubject,
            };

            const newSchoolReport = this.assignSchoolReport(
              common,
              this.roundAverages(existentReports),
            );

            const finalAverage = this.calcFinalAverage(
              (newSchoolReport as unknown) as SchoolReport,
            );
            newSchoolReport.final_average = finalAverage;

            return [...subjectAcc, common];
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

  private roundAverages(
    reports: Record<string, number>,
  ): Record<string, number> {
    return Object.entries(reports).reduce((acc, [key, value]) => {
      return { ...acc, [key]: Math.round(value * 100) };
    }, {});
  }

  private assignSchoolReport(
    target: Record<string, unknown>,
    source: Record<string, number>,
  ): Record<string, unknown> {
    const keys = [
      'first',
      'second',
      'first_rec',
      'third',
      'fourth',
      'second_rec',
      'exam',
    ];
    const filteredObject = Object.entries(source)
      .filter(([key, value]) => {
        if (!keys.includes(key)) return false;
        return value !== undefined;
      })
      .reduce((acc, item) => {
        const [key, value] = item;
        return { ...acc, [key]: value };
      }, {});

    return Object.assign(target, filteredObject);
  }

  private calcFinalAverage(schoolReport: SchoolReport): number {
    const first = schoolReport.first || 0;
    const second = schoolReport.second || 0;
    const third = schoolReport.third || 0;
    const fourth = schoolReport.fourth || 0;
    const first_rec = schoolReport.first_rec || 0;
    const second_rec = schoolReport.second_rec || 0;
    // const exam = schoolReport.exam || 0;

    let firstSemAverage = (first + second) / 2;
    firstSemAverage =
      firstSemAverage >= first_rec ? firstSemAverage : first_rec;

    let secondSemAverage = (third + fourth) / 2;
    secondSemAverage =
      secondSemAverage >= second_rec ? secondSemAverage : first_rec;

    const finalAverage = (firstSemAverage + secondSemAverage) / 2;

    return Math.round(finalAverage);
  }
}

export default CreateSchoolReportsToEnrollService;
