import format from 'date-fns/format';

import { CalendarEvent, GroupedCalendarEvents } from 'models/CalendarEvent';

import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

export const calendarEventMapper = (
  calendarEvents: CalendarEvent[]
): GroupedCalendarEvents => {
  return calendarEvents.reduce((acc, calendarEvent) => {
    const eventDate = parseDateWithoutTimezone(calendarEvent.date);

    const key = format(eventDate, 'yyyy-MM-dd');
    return { ...acc, [key]: calendarEvent };
  }, {});
};
