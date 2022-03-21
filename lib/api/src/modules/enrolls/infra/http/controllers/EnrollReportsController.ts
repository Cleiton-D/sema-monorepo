import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import RegisterSchoolReportsService from '@modules/enrolls/services/RegisterSchoolReportsService';
import ListSchoolReportsService from '@modules/enrolls/services/ListSchoolReportsService';

class EnrollReportsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const {
      enroll_id,
      classroom_id,
      school_subject_id,
      school_year_id,
      student_id,
      grade_id,
      enroll_as,
    } = request.query;

    const listSchoolReports = container.resolve(ListSchoolReportsService);
    const schoolReports = await listSchoolReports.execute({
      enroll_id: enroll_id as string,
      classroom_id: classroom_id as string,
      school_subject_id: school_subject_id as string,
      school_year_id: school_year_id as string,
      student_id: student_id as string,
      grade_id: grade_id as string,
      enroll_as: enroll_as as any,
    });

    return response.json(classToClass(schoolReports));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { school_subject_id, reports } = request.body;

    const registerSchoolReports = container.resolve(
      RegisterSchoolReportsService,
    );

    const schoolReports = await registerSchoolReports.execute({
      school_subject_id,
      reports,
    });

    return response.json(schoolReports);
  }
}

export default EnrollReportsController;
