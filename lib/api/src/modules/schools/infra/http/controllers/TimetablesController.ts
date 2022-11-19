import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateTimetablesService from '@modules/schools/services/UpdateTimetablesService';
import ValidateTimetableService from '@modules/schools/services/ValidateTimetableService';
import ListTimetablesService from '@modules/schools/services/ListTimetablesService';

import { DayOfWeek } from '../../typeorm/entities/Timetable';

class TimetablesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const {
      employee_id,
      classroom_id,
      school_id,
      school_subject_id,
      day_of_week,
      time_start,
      time_end,
    } = request.query;

    const listTimetables = container.resolve(ListTimetablesService);
    const timetables = await listTimetables.execute({
      school_id: school_id as string,
      classroom_id: classroom_id as string,
      employee_id: employee_id as string,
      school_subject_id: school_subject_id as string,
      day_of_week: day_of_week as DayOfWeek,
      time_start: time_start as string,
      time_end: time_end as string,
    });

    return response.json(timetables);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { timetables, classroom_id } = request.body;

    const updateTimetables = container.resolve(UpdateTimetablesService);
    const updatedTimetables = await updateTimetables.execute({
      classroom_id,
      timetables,
    });

    return response.json(updatedTimetables);
  }

  public async validate(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { employee_id, day_of_week, time_start, time_end, classroom_id } =
      request.query;

    const validateTimetable = container.resolve(ValidateTimetableService);
    const result = await validateTimetable.execute({
      classroom_id: classroom_id as string,
      employee_id: employee_id as string,
      day_of_week: day_of_week as DayOfWeek,
      time_start: time_start as string,
      time_end: time_end as string,
    });

    return response.json(result);
  }
}

export default TimetablesController;
