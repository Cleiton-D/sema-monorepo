import { Request, Response } from 'express';
import { container } from 'tsyringe';

import RegisterSchoolReportsService from '@modules/enrolls/services/RegisterSchoolReportsService';
import ListSchoolReportsService from '@modules/enrolls/services/ListSchoolReportsService';

class EnrollReportsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { enroll_id, classroom_id, school_subject_id } = request.query;

    const listSchoolReports = container.resolve(ListSchoolReportsService);
    const schoolReports = await listSchoolReports.execute({
      enroll_id: enroll_id as string,
      classroom_id: classroom_id as string,
      school_subject_id: school_subject_id as string,
    });

    return response.json(schoolReports);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { school_subject_id, school_term, reports } = request.body;

    const registerSchoolReports = container.resolve(
      RegisterSchoolReportsService,
    );

    const schoolReports = await registerSchoolReports.execute({
      school_subject_id,
      school_term,
      reports,
    });

    return response.json(schoolReports);
  }
}

export default EnrollReportsController;
