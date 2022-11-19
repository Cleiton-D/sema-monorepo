import { useMemo } from 'react';
import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { EnrollClassroom } from 'models/EnrollClassroom';

import { initializeApi } from 'services/api';

export type EnrollClassroomsFilters = {
  classroom_id?: string;
  enroll_id?: string;
  status?: string;
  with_old_multigrades?: 0 | 1;
};

export const enrollClassroomsKeys = {
  all: 'enroll-classrooms' as const,
  lists: () => [...enrollClassroomsKeys.all, 'list'] as const,
  list: (filters: string) =>
    [...enrollClassroomsKeys.lists(), { filters }] as const
};

export const listEnrollClassrooms = (
  session?: Session | null,
  filters: EnrollClassroomsFilters = {}
): Promise<EnrollClassroom[]> => {
  const api = initializeApi(session);

  return api
    .get<EnrollClassroom[]>('/enrolls/classrooms', { params: filters })
    .then((response) => response.data);
};

export const useListEnrollClassrooms = (
  session?: Session | null,
  filters: EnrollClassroomsFilters = {}
) => {
  const key = useMemo(
    () => enrollClassroomsKeys.list(JSON.stringify(filters)),
    [filters]
  );

  const result = useQuery(key, () => listEnrollClassrooms(session, filters));
  return { ...result, key };
};
