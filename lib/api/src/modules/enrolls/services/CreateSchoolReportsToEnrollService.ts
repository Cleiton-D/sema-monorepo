import { inject, injectable } from 'tsyringe';

import ISchoolSubjectsRepository from '@modules/education_core/repositories/ISchoolSubjectsRepository';

import CreateSchoolReportDTO from '../dtos/CreateSchoolReportDTO';
import SchoolReport from '../infra/typeorm/entities/SchoolReport';
import ISchoolReportsRepository from '../repositories/ISchoolReportsRepository';
import CalcAnnualAverageService from './CalcAnnualAverageService';
import CalcFinalAverageService from './CalcFinalAverageService';

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
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
    private calcAnnualAverage: CalcAnnualAverageService,
    private calcFinalAverage: CalcFinalAverageService,
  ) {}

  public async execute({
    enroll_id,
    school_subject_id,
    reports,
  }: CreateSchoolReportsToEnrollRequest): Promise<SchoolReport[]> {
    const enrolls = Array.isArray(enroll_id) ? enroll_id : Array.of(enroll_id);

    const schoolSubjects = await this.schoolSubjectsRepository.findAll({
      id: school_subject_id,
      is_multidisciplinary: false,
    });

    const createSchoolReportsData = enrolls.reduce<CreateSchoolReportDTO[]>(
      (acc, enroll) => {
        const items = schoolSubjects.reduce<CreateSchoolReportDTO[]>(
          (subjectAcc, schoolSubject) => {
            const key = schoolSubject.id;
            const existentReports = reports ? reports[key] || {} : {};

            const common = {
              enroll_id: enroll,
              school_subject_id: schoolSubject.id,
            };

            const newSchoolReport =
              this.assignSchoolReport<CreateSchoolReportDTO>(
                common,
                this.roundAverages(existentReports),
              );

            const annualAverage = this.calcAnnualAverage.execute(
              common as unknown as SchoolReport,
            );
            const finalAverage = this.calcFinalAverage.execute(
              common as unknown as SchoolReport,
            );

            newSchoolReport.annual_average = annualAverage as number;
            newSchoolReport.final_average = finalAverage as number;

            return [...subjectAcc, newSchoolReport];
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

  private assignSchoolReport<T extends Record<string, unknown>>(
    target: T,
    source: Record<string, number>,
  ): T {
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
}

export default CreateSchoolReportsToEnrollService;
