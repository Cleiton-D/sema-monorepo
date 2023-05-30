import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IGradeSchoolSubjectsRepository from '@modules/education_core/repositories/IGradeSchoolSubjectsRepository';
import IClassroomTeacherSchoolSubjectsRepository from '@modules/schools/repositories/IClassroomTeacherSchoolSubjectsRepository';
import IEnrollsRepository from '../repositories/IEnrollsRepository';
import ISchoolReportsRepository from '../repositories/ISchoolReportsRepository';
import SchoolReport from '../infra/typeorm/entities/SchoolReport';
import Enroll, { EnrollStatus } from '../infra/typeorm/entities/Enroll';

type UpdateEnrollStatusRequest = {
  enroll_id: string;
};

@injectable()
class UpdateEnrollStatusService {
  constructor(
    @inject('EnrollsRepository') private enrollsRepository: IEnrollsRepository,
    @inject('GradeSchoolSubjectsRepository')
    private gradeSchoolSubjectsRepository: IGradeSchoolSubjectsRepository,
    @inject('ClassroomTeacherSchoolSubjectsRepository')
    private classroomTeacherSchoolSubjectsRepository: IClassroomTeacherSchoolSubjectsRepository,
    @inject('SchoolReportsRepository')
    private schoolReportsRepository: ISchoolReportsRepository,
  ) {}

  private getStatus(schoolReports: SchoolReport[]): EnrollStatus {
    if (!schoolReports.length) return 'ACTIVE';

    const statusSet = new Set(schoolReports.map(({ status }) => status));

    if (statusSet.has('DISAPPROVED_FOR_ABSENCES')) {
      return 'DISAPPROVED_FOR_ABSENCES';
    }

    if (statusSet.has('DISAPPROVED')) return 'DISAPPROVED';

    if (schoolReports.every(({ status }) => status === 'APPROVED')) {
      return 'APPROVED';
    }

    return 'ACTIVE';
  }

  private async filterRequiredSchoolReports(
    enroll: Enroll,
    schoolReports: SchoolReport[],
  ): Promise<SchoolReport[]> {
    const [schoolReport, ...rest] = schoolReports;
    if (!schoolReport) return [];

    const gradeSchoolSubject = await this.gradeSchoolSubjectsRepository.findOne(
      {
        grade_id: enroll.grade_id,
        school_subject_id: schoolReport.school_subject_id,
      },
    );

    const filteredSchoolReports = await this.filterRequiredSchoolReports(
      enroll,
      rest,
    );

    if (!gradeSchoolSubject?.is_required) return filteredSchoolReports;

    const currentClassroom = enroll.getCurrentClassroom();
    if (!currentClassroom) return filteredSchoolReports;

    const classroomTeacherSchoolSubject =
      await this.classroomTeacherSchoolSubjectsRepository.findOne({
        classroom_id: currentClassroom.id,
        school_subject_id: schoolReport.school_subject_id,
      });

    if (!classroomTeacherSchoolSubject?.employee_id) {
      return filteredSchoolReports;
    }

    return [schoolReport, ...filteredSchoolReports];
  }

  public async execute({
    enroll_id,
  }: UpdateEnrollStatusRequest): Promise<void> {
    const enroll = await this.enrollsRepository.findOne({
      id: enroll_id,
    });
    if (!enroll) {
      throw new AppError('Enroll not found');
    }
    const invalidStatus = ['INACTIVE', 'TRANSFERRED', 'QUITTER', 'DECEASED'];
    if (invalidStatus.includes(enroll.status)) return;

    const schoolReports = await this.schoolReportsRepository.findAll({
      enroll_id,
    });

    const filteredSchoolReports = await this.filterRequiredSchoolReports(
      enroll,
      schoolReports,
    );
    const status = this.getStatus(filteredSchoolReports);
    const newEnroll = Object.assign(enroll, { status });

    await this.enrollsRepository.update(newEnroll);
  }
}

export default UpdateEnrollStatusService;
