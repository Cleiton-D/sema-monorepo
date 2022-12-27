import { inject, injectable } from 'tsyringe';

import UpdateSchoolReportStatusByAttendancesService from '@modules/enrolls/services/UpdateSchoolReportStatusByAttendancesService';

import AppError from '@shared/errors/AppError';

import Attendance from '../infra/typeorm/entities/Attendance';
import IAttendancesRepository from '../repositories/IAttendancesRepository';

type RemoveAbsenceJustificationRequest = {
  attendance_id: string;
};

@injectable()
class RemoveAbsenceJustificationService {
  constructor(
    @inject('AttendancesRepository')
    private attendancesRepository: IAttendancesRepository,
    private updateSchoolReportStatusByAttendances: UpdateSchoolReportStatusByAttendancesService,
  ) {}

  public async execute({
    attendance_id,
  }: RemoveAbsenceJustificationRequest): Promise<Attendance> {
    const attendance = await this.attendancesRepository.findOne({
      id: attendance_id,
    });
    if (!attendance) {
      throw new AppError('Attendance not found');
    }

    const newAttendance = Object.assign(attendance, {
      justified: false,
      justification_description: null,
    });

    const [updatedAttendance] = await this.attendancesRepository.updateMany([
      newAttendance,
    ]);

    this.updateSchoolReportStatusByAttendances.execute({
      enroll_id: attendance.enroll_id,
      school_subject_id: attendance.class.school_subject_id,
    });

    return updatedAttendance;
  }
}

export default RemoveAbsenceJustificationService;
