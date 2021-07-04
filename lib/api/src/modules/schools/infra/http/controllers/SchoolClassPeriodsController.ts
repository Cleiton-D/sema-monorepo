import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DefineSchoolClassPeriodsService from '@modules/schools/services/DefineSchoolClassPeriodsService';
import ListSchoolClassPeriodsService from '@modules/schools/services/ListSchoolClassPeriodsService';

class SchoolClassPeriodsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { school_id } = request.params;
    const { school_year_id } = request.query;

    const listSchoolClassPeriods = container.resolve(
      ListSchoolClassPeriodsService,
    );

    const schoolClassPeriods = await listSchoolClassPeriods.execute({
      school_id,
      school_year_id: school_year_id as string,
    });

    return response.json(schoolClassPeriods);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { school_id } = request.params;
    const { school_year_id, class_periods } = request.body;

    const defineSchoolClassperiods = container.resolve(
      DefineSchoolClassPeriodsService,
    );

    const classPeriods = await defineSchoolClassperiods.execute({
      school_id,
      school_year_id,
      class_periods,
    });

    return response.json(classPeriods);
  }
}

export default SchoolClassPeriodsController;
