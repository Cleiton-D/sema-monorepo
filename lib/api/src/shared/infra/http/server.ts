import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';

import contactsRoutes from '@modules/contacts/infra/http/routes/contacts.routes';
import adressesRoutes from '@modules/address/infra/http/routes/adresses.routes';
import employeesRoutes from '@modules/employees/infra/http/routes/employees.routes';
import appRoutes from '@modules/authorization/infra/http/routes/app.routes';
import userProfilesRoutes from '@modules/users/infra/http/routes/userProfiles.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import schoolsRoutes from '@modules/schools/infra/http/routes/schools.routes';
import studentRouter from '@modules/students/infra/http/routes/student.routes';
import educationAdminRouter from '@modules/education_core/infra/http/routes/education_admin.routes';
import teachersRouter from '@modules/teachers/infra/http/routes/teachers.routes';
import classesRouter from '@modules/classes/infra/http/routes/classes.routes';
import attendancesRouter from '@modules/classes/infra/http/routes/attendances.routes';
import enrollsRouter from '@modules/enrolls/infra/http/routes/enrolls.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import personRouter from '@modules/persons/infra/http/routes/person.routes';
import adminRouter from '@modules/admin/infra/http/routes/admin.routes';
import timetablesRouter from '@modules/schools/infra/http/routes/timetables.routes';
import classroomRouter from '@modules/schools/infra/http/routes/classrooms.routes';
import classroomTeacherSchoolSubjectsRouter from '@modules/schools/infra/http/routes/classroom_teacher_school_subjects.routes';
import multigradesRouter from '@modules/schools/infra/http/routes/multigrades.routes';
import calendarEventsRouter from '@modules/education_core/infra/http/routes/calendar_events.routes';

import AppError from '@shared/errors/AppError';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/contacts', contactsRoutes);
app.use('/adresses', adressesRoutes);
app.use('/employees', employeesRoutes);
app.use('/app', appRoutes);
app.use('/user-profiles', userProfilesRoutes);
app.use('/users', usersRouter);
app.use('/sessions', sessionsRouter);
app.use('/schools', schoolsRoutes);
app.use('/students', studentRouter);
app.use('/education/admin', educationAdminRouter);
app.use('/admin', adminRouter);
app.use('/teachers', teachersRouter);
app.use('/classes', classesRouter);
app.use('/attendances', attendancesRouter);
app.use('/enrolls', enrollsRouter);
app.use('/persons', personRouter);
app.use('/timetables', timetablesRouter);
app.use('/classrooms', classroomRouter);
app.use('/multigrades', multigradesRouter);
app.use(
  '/classroom-teacher-school-subjects',
  classroomTeacherSchoolSubjectsRouter,
);
app.use('/calendar-events', calendarEventsRouter);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  console.error(err);

  return response
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

export default app;
