import {
  CalendarEventCompetence,
  CalendarEventType,
} from '../infra/typeorm/entities/CalendarEvent';

type CreateCalendarEventDTO = {
  school_year_id: string;
  date: Date | string;
  description: string;
  type: CalendarEventType;
  competence: CalendarEventCompetence;
  school_id?: string;
};

export default CreateCalendarEventDTO;
