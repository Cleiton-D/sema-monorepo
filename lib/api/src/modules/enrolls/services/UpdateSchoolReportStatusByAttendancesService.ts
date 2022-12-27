import { inject, injectable } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import IGradeSchoolSubjectsRepository from '@modules/education_core/repositories/IGradeSchoolSubjectsRepository';
import IGradesRepository from '@modules/education_core/repositories/IGradesRepository';
import CountAttendancesService from '@modules/classes/services/CountAttendancesService';

import AppError from '@shared/errors/AppError';

import IEnrollsRepository from '../repositories/IEnrollsRepository';
import SchoolReport from '../infra/typeorm/entities/SchoolReport';
import ISchoolReportsRepository from '../repositories/ISchoolReportsRepository';
import ValidateSchoolReportStatusService from './ValidateSchoolReportStatusService';
import UpdateEnrollStatusService from './UpdateEnrollStatusService';

type UpdateSchoolReportStatusByAttendancesRequest = {
  enroll_id: string;
  school_subject_id: string;
};

type CreateNewSchoolReportPayload = {
  schoolReport: SchoolReport;
  maxAbsences: number;
  totalAbsences: number;
};

@injectable()
class UpdateSchoolReportStatusByAttendancesService {
  constructor(
    @inject('EnrollsRepository') private enrollsRepository: IEnrollsRepository,
    @inject('GradesRepository') private gradesRepository: IGradesRepository,
    @inject('GradeSchoolSubjectsRepository')
    private gradeSchoolSubjectsRepository: IGradeSchoolSubjectsRepository,
    @inject('SchoolReportsRepository')
    private schoolReportsRepository: ISchoolReportsRepository,
    private countAttendances: CountAttendancesService,
    private validateSchoolReportStatus: ValidateSchoolReportStatusService,
    private updateEnrollStatus: UpdateEnrollStatusService,
  ) {}

  private async createNewSchoolReport({
    schoolReport,
    maxAbsences,
    totalAbsences,
  }: CreateNewSchoolReportPayload): Promise<SchoolReport> {
    let status = await this.validateSchoolReportStatus.execute({
      schoolReport,
    });
    if (totalAbsences >= maxAbsences) {
      status = 'DISAPPROVED_FOR_ABSENCES';
    }

    return Object.assign(schoolReport, { status: status || 'ACTIVE' });
  }

  public async execute({
    enroll_id,
    school_subject_id,
  }: UpdateSchoolReportStatusByAttendancesRequest): Promise<void> {
    const enroll = await this.enrollsRepository.findOne({ id: enroll_id });
    if (!enroll) {
      throw new AppError('Enroll not found');
    }

    const grade = await this.gradesRepository.findById(enroll.grade_id);
    if (!grade) {
      throw new AppError('Grade not found');
    }

    let gradeSchoolSubject = await this.gradeSchoolSubjectsRepository.findOne({
      grade_id: enroll.grade_id,
      school_subject_id: grade.is_multidisciplinary
        ? undefined
        : school_subject_id,
      is_multidisciplinary: grade.is_multidisciplinary,
    });
    gradeSchoolSubject = instanceToInstance(gradeSchoolSubject);

    if (!gradeSchoolSubject) {
      throw new AppError('Grade School Subject not found');
    }

    const schoolReports = await this.schoolReportsRepository.findAll({
      enroll_id: enroll.id,
      school_subject_id: grade.is_multidisciplinary
        ? undefined
        : school_subject_id,
    });

    const [absences] = await this.countAttendances.execute({
      attendance: false,
      justified: false,
      enroll_id: enroll.id,
      school_subject_id: gradeSchoolSubject.school_subject_id,
      split_by_school_subject: true,
      split_by_school_term: false,
    });

    const maxAbsences = gradeSchoolSubject.workload * 0.25;
    const newSchoolReports = await Promise.all(
      schoolReports.map(schoolReport => {
        return this.createNewSchoolReport({
          schoolReport,
          maxAbsences,
          totalAbsences: absences?.absences || 0,
        });
      }),
    );

    await this.schoolReportsRepository.updateMany(newSchoolReports);
    await this.updateEnrollStatus.execute({ enroll_id });
  }
}

export default UpdateSchoolReportStatusByAttendancesService;
