import { injectable } from 'tsyringe';

import SchoolReport, {
  SchoolReportStatus,
} from '../infra/typeorm/entities/SchoolReport';

type ValidateEnrollStatusRequest = {
  schoolReport: SchoolReport;
};

@injectable()
class ValidateSchoolReportStatusService {
  public async execute({
    schoolReport,
  }: ValidateEnrollStatusRequest): Promise<SchoolReportStatus | undefined> {
    if (schoolReport.status === 'DISAPPROVED_FOR_ABSENCES') return undefined;

    if (
      schoolReport.first === null ||
      schoolReport.second === null ||
      schoolReport.third === null ||
      schoolReport.fourth === null
    ) {
      return undefined;
    }

    if (schoolReport.final_average >= 600) return 'APPROVED';
    if (schoolReport.exam !== null && schoolReport.final_average >= 500) {
      return 'APPROVED';
    }
    if (schoolReport.exam !== null && schoolReport.final_average < 500) {
      return 'DISAPPROVED';
    }

    if (schoolReport.first_rec !== null || schoolReport.second_rec !== null) {
      return 'EXAM';
    }

    return 'RECOVERY';
  }
}

export default ValidateSchoolReportStatusService;
