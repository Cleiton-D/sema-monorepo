import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCalendarEventService from '@modules/education_core/services/CreateCalendarEventService';
import ListCalendarEventsService from '@modules/education_core/services/ListCalendarEventsService';
import DeleteCalendarEventService from '@modules/education_core/services/DeleteCalendarEventService';

import privateRoute from '@shared/decorators/privateRoute';
import {
  CalendarEventCompetence,
  CalendarEventType,
} from '../../typeorm/entities/CalendarEvent';

class CalendarEventsController {
  @privateRoute({ module: 'CALENDAR', rule: 'READ' })
  public async index(request: Request, response: Response): Promise<Response> {
    const { school_year_id, date, description, type, competence, school_id } =
      request.query;

    const listCalendarEvents = container.resolve(ListCalendarEventsService);
    const calendarEvents = await listCalendarEvents.execute({
      school_year_id: school_year_id as string,
      date: date as string,
      description: description as string,
      type: type as CalendarEventType,
      competence: competence as CalendarEventCompetence,
      school_id: school_id as string,
    });

    return response.json(calendarEvents);
  }

  @privateRoute({ module: 'CALENDAR', rule: 'WRITE' })
  public async create(request: Request, response: Response): Promise<Response> {
    const { school_year_id, date, description, type, competence, school_id } =
      request.body;

    const createCalendarEvent = container.resolve(CreateCalendarEventService);
    const calendarEvent = await createCalendarEvent.execute({
      school_year_id,
      date,
      description,
      type,
      competence,
      school_id,
    });

    return response.json(calendarEvent);
  }

  @privateRoute({ module: 'CALENDAR', rule: 'WRITE' })
  public async delete(request: Request, response: Response): Promise<Response> {
    const { calendar_event_id } = request.params;

    const deleteCalendarEvent = container.resolve(DeleteCalendarEventService);
    await deleteCalendarEvent.execute({ calendar_event_id });

    return response.sendStatus(204);
  }
}

export default CalendarEventsController;
