import { inject, injectable } from 'tsyringe';

import UpdateSchoolReportStatusByAttendancesService from '@modules/enrolls/services/UpdateSchoolReportStatusByAttendancesService';

import AppError from '@shared/errors/AppError';

import Attendance from '../infra/typeorm/entities/Attendance';
import IAttendancesRepository from '../repositories/IAttendancesRepository';

type JustifyAbsenceRequest = {
  attendanceId: string;
  description: string;
};

@injectable()
class JustifyAbsenceService {
  constructor(
    @inject('AttendancesRepository')
    private attendancesRepository: IAttendancesRepository,
    private updateSchoolReportStatusByAttendances: UpdateSchoolReportStatusByAttendancesService,
  ) {}

  public async execute({
    attendanceId,
    description,
  }: JustifyAbsenceRequest): Promise<Attendance> {
    const attendance = await this.attendancesRepository.findOne({
      id: attendanceId,
    });
    if (!attendance) {
      throw new AppError('Attendance not found');
    }

    if (!description || description === '') {
      throw new AppError('Description cannot be empty');
    }

    const newAttendance = Object.assign(attendance, {
      justified: true,
      justification_description: description,
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

export default JustifyAbsenceService;
