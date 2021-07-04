import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSchoolYearService from '@modules/education_core/services/CreateSchoolYearService';
import ShowSchoolYearService from '@modules/education_core/services/ShowSchoolYearService';
import UpdateSchoolYearService from '@modules/education_core/services/UpdateSchoolYearService';

class SchoolYearsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { school_year_id } = request.params;

    const showSchoolYear = container.resolve(ShowSchoolYearService);
    const schoolYear = await showSchoolYear.execute({ school_year_id });

    return response.json(schoolYear);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { reference_year, date_start, date_end } = request.body;

    const createSchoolYear = container.resolve(CreateSchoolYearService);

    const schoolYear = await createSchoolYear.execute({
      reference_year,
      date_start,
      date_end,
    });

    return response.json(schoolYear);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { school_year_id } = request.params;
    const { reference_year, date_start, date_end } = request.body;

    const updateSchoolYear = container.resolve(UpdateSchoolYearService);

    const schoolYear = await updateSchoolYear.execute({
      school_year_id,
      reference_year,
      date_start,
      date_end,
    });

    return response.json(schoolYear);
  }
}

export default SchoolYearsController;
