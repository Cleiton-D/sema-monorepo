import { inject, injectable } from 'tsyringe';

import ICalendarEventsRespository from '../repositories/ICalendarEventsRepository';
import CalendarEvent, {
  CalendarEventCompetence,
  CalendarEventType,
} from '../infra/typeorm/entities/CalendarEvent';

type ListCalendarEventsRequest = {
  id?: string;
  school_year_id?: string;
  date?: string | Date;
  description?: string;
  type?: CalendarEventType;
  competence?: CalendarEventCompetence | 'ALL';
  school_id?: string;
};

@injectable()
class ListCalendarEventsService {
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
  }: ListCalendarEventsRequest): Promise<CalendarEvent[]> {
    const calendarEvents = await this.calendarEventsRespository.findAll({
      school_year_id,
      date,
      description,
      type,
      competence,
      school_id,
    });

    return calendarEvents;
  }
}

export default ListCalendarEventsService;
