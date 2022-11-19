import { inject, injectable } from 'tsyringe';

import ICalendarEventsRespository from '../repositories/ICalendarEventsRepository';
import CalendarEvent, {
  CalendarEventCompetence,
  CalendarEventType,
} from '../infra/typeorm/entities/CalendarEvent';

type CreateCalendarEventRequest = {
  school_year_id: string;
  date: Date | string;
  description: string;
  type: CalendarEventType;
  competence: CalendarEventCompetence;
  school_id?: string;
};

@injectable()
class CreateCalendarEventService {
  constructor(
    @inject('CalendarEventsRespository')
    private calendarEventsRespository: ICalendarEventsRespository,
  ) {}

  public async execute({
    school_year_id,
    date,
    description,
    type,
    competence,
    school_id,
  }: CreateCalendarEventRequest): Promise<CalendarEvent> {
    const calendarEvent = await this.calendarEventsRespository.create({
      school_year_id,
      date,
      description,
      type,
      competence,
      school_id,
    });
    return calendarEvent;
  }
}

export default CreateCalendarEventService;
