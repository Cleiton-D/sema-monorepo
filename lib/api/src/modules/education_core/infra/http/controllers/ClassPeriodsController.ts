import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DefineClassPeriodsService from '@modules/education_core/services/DefineClassPeriodsService';
import ListClassPeriodsService from '@modules/education_core/services/ListClassPeriodsService';
import DeleteClassPeriodService from '@modules/education_core/services/DeleteClassPeriodService';

class ClassPeriodsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listClassPeriods = container.resolve(ListClassPeriodsService);
    const classPeriods = await listClassPeriods.execute();

    return response.json(classPeriods);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const requestData = request.body;

    const defineClassPeriods = container.resolve(DefineClassPeriodsService);
    const classPeriods = await defineClassPeriods.execute(requestData);

    return response.json(classPeriods);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { class_period_id } = request.params;

    const deleteClassPeriod = container.resolve(DeleteClassPeriodService);
    await deleteClassPeriod.execute({ class_period_id });

    return response.status(204).send();
  }
}

export default ClassPeriodsController;
