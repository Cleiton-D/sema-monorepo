import { inject, injectable } from 'tsyringe';

import ISchoolSubjectsRepository from '@modules/education_core/repositories/ISchoolSubjectsRepository';
import IGradeSchoolSubjectsRepository from '@modules/education_core/repositories/IGradeSchoolSubjectsRepository';

import AppError from '@shared/errors/AppError';

import SchoolReport from '../infra/typeorm/entities/SchoolReport';
import IEnrollsRepository from '../repositories/IEnrollsRepository';
import ISchoolReportsRepository from '../repositories/ISchoolReportsRepository';

type SchoolReportRequestType = {
  enroll_id: string;
  averages: {
    first?: number;
    second?: number;
    first_rec?: number;
    third?: number;
    fourth?: number;
    second_rec?: number;
    exam?: number;
  };
};

type RegisterSchoolReportsRequest = {
  school_subject_id: string;
  reports: SchoolReportRequestType[];
};

@injectable()
class RegisterSchoolReportsService {
  constructor(
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
    @inject('GradeSchoolSubjectsRepository')
    private gradeSchoolSubjectsRepository: IGradeSchoolSubjectsRepository,
    @inject('EnrollsRepository') private enrollsRepository: IEnrollsRepository,
    @inject('SchoolReportsRepository')
    private schoolReportsRepository: ISchoolReportsRepository,
  ) {}

  public async execute({
    school_subject_id,
    reports,
  }: RegisterSchoolReportsRequest): Promise<SchoolReport[]> {
    const schoolSubject = await this.schoolSubjectsRepository.findByid(
      school_subject_id,
    );
    if (!schoolSubject) {
      throw new AppError('SchoolSubject not found');
    }

    const gradeSchoolSubjects = await this.gradeSchoolSubjectsRepository.find({
      school_subject_id,
    });
    const existentGrades = gradeSchoolSubjects.map(
      gradeSchoolSubject => gradeSchoolSubject.grade_id,
    );

    const reportsObject = reports.reduce<
      Record<string, SchoolReportRequestType['averages']>
    >((acc, item) => {
      const enrollAverages = Object.entries(item.averages).reduce<
        SchoolReportRequestType['averages']
      >(
        (accAverages, [key, value]) => ({
          ...accAverages,
          [key]: Math.round(value * 100),
        }),
        {},
      );

      return {
        ...acc,
        [item.enroll_id]: enrollAverages,
      };
    }, {});

    const enrollIds = Object.keys(reportsObject);
    const enrolls = await this.enrollsRepository.findAllByIds(enrollIds);

    enrolls.forEach(enroll => {
      if (!existentGrades.includes(enroll.grade_id)) {
        throw new AppError('enrollment not associated with school subject');
      }
    });

    const currentSchoolReports = await this.schoolReportsRepository.findAll({
      enroll_id: enrollIds,
      school_subject_id,
    });

    const newSchoolReports = currentSchoolReports.map(schoolReport => {
      const requestAverages = reportsObject[schoolReport.enroll_id];

      const newSchoolReport = this.assignSchoolReport(
        schoolReport,
        requestAverages,
      );

      const finalAverage = this.calcFinalAverage(newSchoolReport);
      newSchoolReport.final_average = finalAverage;

      return newSchoolReport;
    });

    return this.schoolReportsRepository.updateMany(newSchoolReports);
  }

  private assignSchoolReport(
    target: SchoolReport,
    source: SchoolReportRequestType['averages'],
  ): SchoolReport {
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

export default RegisterSchoolReportsService;
