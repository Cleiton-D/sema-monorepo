export type CalendarEventType = 'HOLIDAY' | 'SCHOOL_WEEKEND';
export type CalendarEventCompetence = 'SCHOLL' | 'MUNICIPAL';

export type CalendarEvent = {
  id: string;
  school_year_id: string;
  date: Date | string;
  description: string;
  type: CalendarEventType;
  competence: CalendarEventCompetence;
  school_id?: string;
  created_at: Date | string;
  updated_at: Date | string;
};

export type GroupedCalendarEvents = Record<string, CalendarEvent>;
