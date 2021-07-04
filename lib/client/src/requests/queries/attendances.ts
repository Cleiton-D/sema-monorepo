import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { Attendance } from 'models/Attendance';

import { initializeApi } from 'services/api';

type ListAttendancesFilters = {
  class_id?: string;
  classroom_id?: string;
};

export const listAttendances = (
  session: Session | null,
  filters: ListAttendancesFilters = {}
) => {
  const { class_id, ...params } = filters;
  if (!class_id) return [];

  const api = initializeApi(session);

  return api
    .get<Attendance[]>(`/classes/${class_id}/attendances`, { params })
    .then((response) => response.data);
};

export const useListAttendances = (
  session: Session | null,
  filters: ListAttendancesFilters = {}
) => {
  const key = `list-attendances-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => listAttendances(session, filters));

  return { ...result, key };
};
