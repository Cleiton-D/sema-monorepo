import { useMemo } from 'react';
import { Session } from 'next-auth';
import { QueryObserverOptions, useQuery } from 'react-query';

import {
  CalendarEvent,
  CalendarEventCompetence,
  CalendarEventType
} from 'models/CalendarEvent';

import { initializeApi } from 'services/api';

export const calendarEventsKeys = {
  all: 'calendar-events' as const,
  lists: () => [...calendarEventsKeys.all, 'list'] as const,
  list: (filters: string) =>
    [...calendarEventsKeys.lists(), { filters }] as const
};

export type ListCalendarEventsFilters = {
  school_year_id?: string;
  date?: string | Date;
  description?: string;
  type?: CalendarEventType;
  competence?: CalendarEventCompetence | 'ALL';
  school_id?: string;
};

export const listCalendarEvents = (
  session: Session | null,
  filters: ListCalendarEventsFilters = {}
) => {
  const api = initializeApi(session);

  return api
    .get<CalendarEvent[]>('/calendar-events', { params: filters })
    .then((response) => response.data);
};

export const useListCalendarEvents = (
  session: Session | null,
  filters: ListCalendarEventsFilters = {},
  queryOptions: QueryObserverOptions<CalendarEvent[]> = {}
) => {
  const key = useMemo(
    () => calendarEventsKeys.list(JSON.stringify(filters)),
    [filters]
  );

  const result = useQuery<CalendarEvent[]>(
    key,
    () => listCalendarEvents(session, filters),
    queryOptions
  );
  return { ...result, key };
};
