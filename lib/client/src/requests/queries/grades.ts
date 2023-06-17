import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { Grade } from 'models/Grade';
import { createUnstableApi } from 'services/api';

type CountGradesResponse = {
  count: number;
};

type ListGradesFilters = {
  school_year_id?: string;
};

export const gradesKeys = {
  all: 'classrooms' as const,
  lists: () => [...gradesKeys.all, 'list'] as const,
  list: (filters: string) => [...gradesKeys.lists(), { filters }] as const,
  shows: () => [...gradesKeys.all, 'show'] as const,
  show: (filters: string) => [...gradesKeys.shows(), { filters }] as const,
  counts: () => [...gradesKeys.all, 'show'] as const,
  count: (filters: string) => [...gradesKeys.counts(), { filters }] as const
};

export const listGrades = (
  params: ListGradesFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<Grade[]>('/education/admin/grades', { params })
    .then((response) => response.data);
};

export const gradesCount = (
  params: ListGradesFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<CountGradesResponse>('/education/admin/grades/count', { params })
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useListGrades = (params: ListGradesFilters = {}) => {
  const key = useMemo(() => gradesKeys.list(JSON.stringify(params)), [params]);

  return useQuery(key, () => listGrades(params));
};

export const useGradesCount = (params: ListGradesFilters = {}) => {
  const key = useMemo(() => gradesKeys.count(JSON.stringify(params)), [params]);

  const result = useQuery(key, () => gradesCount(params));

  return { ...result, key };
};

export const showGrade = (gradeId?: string, session?: AppSession) => {
  if (!gradeId) return undefined;

  const api = createUnstableApi(session);

  return api
    .get<Grade>(`/education/admin/grades/${gradeId}`)
    .then((response) => response.data);
};

export const useShowGrade = (gradeId?: string) => {
  const key = useMemo(
    () => gradesKeys.show(JSON.stringify({ gradeId })),
    [gradeId]
  );

  return useQuery(key, () => showGrade(gradeId));
};
