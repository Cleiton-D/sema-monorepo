import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICalendarEventsRespository from '../repositories/ICalendarEventsRepository';

type DeleteCalendarEventRequest = {
  calendar_event_id: string;
};

@injectable()
class DeleteCalendarEventService {
  constructor(
    @inject('CalendarEventsRespository')
    private calendarEventsRespository: ICalendarEventsRespository,
  ) {}

  public async execute({
    calendar_event_id,
  }: DeleteCalendarEventRequest): Promise<void> {
    const calendarEvent = await this.calendarEventsRespository.findOne({
      id: calendar_event_id,
    });
    if (!calendarEvent) {
      throw new AppError('Calendar event not found');
    }

    await this.calendarEventsRespository.delete(calendarEvent);
  }
}

export default DeleteCalendarEventService;
