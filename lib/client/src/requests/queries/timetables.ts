import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { DayOfWeek } from 'models/DafOfWeek';
import { Timetable } from 'models/Timetable';

import { initializeApi } from 'services/api';

type ListTimetablesRequest = {
  employee_id?: string;
  classroom_id?: string;
  school_id?: string;
  school_subject_id?: string;
  day_of_week?: DayOfWeek;
  time_start?: string;
  time_end?: string;
};

export const listTimetables = (
  session: Session | null,
  params: ListTimetablesRequest
) => {
  const api = initializeApi(session);

  return api
    .get<Timetable[]>(`/timetables`, {
      params
    })
    .then((response) => response.data);
};

export const useListTimetables = (
  session: Session | null,
  filters: ListTimetablesRequest
) => {
  const key = ['timetables', 'list', JSON.stringify(filters)];
  const result = useQuery(key, () => listTimetables(session, filters));

  return { ...result, key };
};

type ValidateTimetableRequest = {
  classroom_id: string;
  school_id: string;
  employee_id: string;
  day_of_week: DayOfWeek;
  time_start: string;
  time_end: string;
};

type ValidateTimetableResponse = {
  existent?: Timetable;
  isValid: boolean;
};

export const validateTimetable = (
  session: Session | null,
  params: ValidateTimetableRequest
) => {
  const api = initializeApi(session);

  return api
    .get<ValidateTimetableResponse>(`/timetables/validate`, {
      params
    })
    .then((response) => response.data);
};
