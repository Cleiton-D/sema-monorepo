import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListSchoolTermPeriodsService from '@modules/education_core/services/ListSchoolTermPeriodsService';
import DefineSchoolTermPeriodsService from '@modules/education_core/services/DefineSchoolTermPeriodsService';

class SchoolTermPeriodsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { school_year_id } = request.query;

    const listSchoolTermPeriods = container.resolve(
      ListSchoolTermPeriodsService,
    );

    const schoolTermPeriods = await listSchoolTermPeriods.execute({
      school_year_id: String(school_year_id),
    });

    return response.json(schoolTermPeriods);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { school_year_id, term_periods } = request.body;

    const defineSchoolTermPeriods = container.resolve(
      DefineSchoolTermPeriodsService,
    );

    const schoolTermPeriods = await defineSchoolTermPeriods.execute({
      school_year_id,
      term_periods,
    });

    return response.json(schoolTermPeriods);
  }
}

export default SchoolTermPeriodsController;
