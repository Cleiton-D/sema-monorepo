import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListSchoolTermPeriodsService from '@modules/education_core/services/ListSchoolTermPeriodsService';
import DefineSchoolTermPeriodsService from '@modules/education_core/services/DefineSchoolTermPeriodsService';
import ShowSchoolTermPeriodService from '@modules/education_core/services/ShowSchoolTermPeriodService';
import UpdateSchoolTermPeriodService from '@modules/education_core/services/UpdateSchoolTermPeriodService';

import { TermPeriodStatus } from '../../typeorm/entities/SchoolTermPeriod';

class SchoolTermPeriodsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { school_year_id, status } = request.query;

    const showSchoolTermPeriod = container.resolve(ShowSchoolTermPeriodService);

    const schoolTermPeriod = await showSchoolTermPeriod.execute({
      school_year_id: String(school_year_id),
      status: status as TermPeriodStatus,
    });

    return response.json(schoolTermPeriod);
  }

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

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { date_start, date_end, status } = request.body;

    const updateSchoolTermPeriod = container.resolve(
      UpdateSchoolTermPeriodService,
    );

    const schoolTermPeriod = await updateSchoolTermPeriod.execute({
      id,
      date_start,
      date_end,
      status,
    });

    return response.json(schoolTermPeriod);
  }
}

export default SchoolTermPeriodsController;
