import { Router } from 'express';

import CalendarEventsController from '../controllers/CalendarEventsController';

const calendarEventsRouter = Router();

const calendarEventsController = new CalendarEventsController();

calendarEventsRouter.post('/', calendarEventsController.create);
calendarEventsRouter.get('/', calendarEventsController.index);
calendarEventsRouter.delete(
  '/:calendar_event_id',
  calendarEventsController.delete,
);

export default calendarEventsRouter;
