import CreateCalendarEventDTO from '../dtos/CreateCalendarEventDTO';
import FindCalendarEventDTO from '../dtos/FindCalendarEventDTO';

import CalendarEvent from '../infra/typeorm/entities/CalendarEvent';

export default interface ICalendarEventsRespository {
  findOne: (
    filters: FindCalendarEventDTO,
  ) => Promise<CalendarEvent | undefined>;
  findAll: (filters: FindCalendarEventDTO) => Promise<CalendarEvent[]>;
  create: (data: CreateCalendarEventDTO) => Promise<CalendarEvent>;
  delete: (calendarEvent: CalendarEvent) => Promise<void>;
}
