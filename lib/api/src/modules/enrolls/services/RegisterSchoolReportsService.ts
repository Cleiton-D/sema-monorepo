import { inject, injectable } from 'tsyringe';

import ISchoolSubjectsRepository from '@modules/education_core/repositories/ISchoolSubjectsRepository';
import IGradeSchoolSubjectsRepository from '@modules/education_core/repositories/IGradeSchoolSubjectsRepository';

import AppError from '@shared/errors/AppError';

import SchoolReport from '../infra/typeorm/entities/SchoolReport';
import IEnrollsRepository from '../repositories/IEnrollsRepository';
import ISchoolReportsRepository from '../repositories/ISchoolReportsRepository';
import CalcAnnualAverageService from './CalcAnnualAverageService';
import CalcFinalAverageService from './CalcFinalAverageService';
import ValidateSchoolReportStatusService from './ValidateSchoolReportStatusService';
import UpdateEnrollStatusService from './UpdateEnrollStatusService';

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

type ReportAveragesDTO = Record<string, SchoolReportRequestType['averages']>;

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
    private calcAnnualAverage: CalcAnnualAverageService,
    private calcFinalAverage: CalcFinalAverageService,
    private validateSchoolReportStatus: ValidateSchoolReportStatusService,
    private updateEnrollStatus: UpdateEnrollStatusService,
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

    const reportsObject = reports.reduce<ReportAveragesDTO>((acc, item) => {
      const enrollAverages = Object.entries(item.averages).reduce<
        SchoolReportRequestType['averages']
      >((accAverages, [key, value]) => {
        if (value === null) return { ...accAverages, [key]: null };

        return {
          ...accAverages,
          [key]: Math.round(value * 100),
        };
      }, {});

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

    const newSchoolReports = await Promise.all(
      currentSchoolReports.map(schoolReport => {
        return this.createNewSchoolReport(schoolReport, reportsObject);
      }),
    );

    const updatedSchoolReports = await this.schoolReportsRepository.updateMany(
      newSchoolReports,
    );

    enrollIds.forEach(enroll_id => {
      this.updateEnrollStatus.execute({ enroll_id });
    });

    return updatedSchoolReports;
  }

  private async createNewSchoolReport(
    schoolReport: SchoolReport,
    reportsObject: ReportAveragesDTO,
  ): Promise<SchoolReport> {
    const requestAverages = reportsObject[schoolReport.enroll_id];

    const newSchoolReport = this.assignSchoolReport(
      schoolReport,
      requestAverages,
    );

    const annualAverage = this.calcAnnualAverage.execute(newSchoolReport);
    const finalAverage = this.calcFinalAverage.execute(newSchoolReport);

    newSchoolReport.annual_average = annualAverage as number;
    newSchoolReport.final_average = finalAverage as number;

    const schoolReportStatus = await this.validateSchoolReportStatus.execute({
      schoolReport: newSchoolReport,
    });

    if (!schoolReportStatus) return newSchoolReport;

    return Object.assign(newSchoolReport, {
      status: schoolReportStatus,
    });
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
}

export default RegisterSchoolReportsService;
