import { inject, injectable } from 'tsyringe';

import ISchoolSubjectsRepository from '@modules/education_core/repositories/ISchoolSubjectsRepository';
import IGradeSchoolSubjectsRepository from '@modules/education_core/repositories/IGradeSchoolSubjectsRepository';

import AppError from '@shared/errors/AppError';
import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';

import SchoolReport from '../infra/typeorm/entities/SchoolReport';
import IEnrollsRepository from '../repositories/IEnrollsRepository';
import ISchoolReportsRepository from '../repositories/ISchoolReportsRepository';

type SchoolReportRequestType = {
  enroll_id: string;
  average: number;
};

type RegisterSchoolReportsRequest = {
  school_subject_id: string;
  school_term: SchoolTerm;
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
    school_term,
    reports,
  }: RegisterSchoolReportsRequest): Promise<SchoolReport[]> {
    if (!['FIRST', 'SECOND', 'THIRD', 'FOURTH'].includes(school_term)) {
      throw new AppError('invalid school term');
    }

    const reportsObject = reports.reduce<Record<string, number>>(
      (acc, item) => ({ ...acc, [item.enroll_id]: item.average * 100 }),
      {},
    );

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
      school_term,
    });

    const newSchoolReports = currentSchoolReports.map(schoolReport => {
      const requestAverage = reportsObject[schoolReport.enroll_id];
      if (requestAverage === undefined) return schoolReport;

      return Object.assign(schoolReport, {
        average: requestAverage,
      });
    });

    return this.schoolReportsRepository.updateMany(newSchoolReports);
  }
}

export default RegisterSchoolReportsService;
