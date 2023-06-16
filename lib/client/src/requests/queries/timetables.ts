import { useQuery } from 'react-query';

import { DayOfWeek } from 'models/DafOfWeek';
import { Timetable } from 'models/Timetable';

import { createUnstableApi } from 'services/api';

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
  params: ListTimetablesRequest,
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<Timetable[]>(`/timetables`, {
      params
    })
    .then((response) => response.data);
};

export const useListTimetables = (filters: ListTimetablesRequest) => {
  const key = ['timetables', 'list', JSON.stringify(filters)];
  const result = useQuery(key, () => listTimetables(filters));

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
  params: ValidateTimetableRequest,
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<ValidateTimetableResponse>(`/timetables/validate`, {
      params
    })
    .then((response) => response.data);
};
