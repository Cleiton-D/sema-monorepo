import {
  CalendarEventCompetence,
  CalendarEventType,
} from '../infra/typeorm/entities/CalendarEvent';

type FindCalendarEventDTO = {
  id?: string;
  school_year_id?: string;
  date?: string | Date;
  description?: string;
  type?: CalendarEventType;
  competence?: CalendarEventCompetence | 'ALL';
  school_id?: string;
};

export default FindCalendarEventDTO;
