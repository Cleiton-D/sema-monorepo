import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { Grade } from 'models/Grade';
import { initializeApi } from 'services/api';
import { useMemo } from 'react';

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
  session?: Session | null,
  params: ListGradesFilters = {}
) => {
  const api = initializeApi(session);

  return api
    .get<Grade[]>('/education/admin/grades', { params })
    .then((response) => response.data);
};

export const gradesCount = (
  session?: Session | null,
  params: ListGradesFilters = {}
) => {
  const api = initializeApi(session);

  return api
    .get<CountGradesResponse>('/education/admin/grades/count', { params })
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useListGrades = (
  session?: Session | null,
  params: ListGradesFilters = {}
) => {
  const key = useMemo(() => gradesKeys.list(JSON.stringify(params)), [params]);

  return useQuery(key, () => listGrades(session, params));
};

export const useGradesCount = (
  session?: Session | null,
  params: ListGradesFilters = {}
) => {
  const key = useMemo(() => gradesKeys.count(JSON.stringify(params)), [params]);

  const result = useQuery(key, () => gradesCount(session, params));

  return { ...result, key };
};

export const showGrade = (session?: Session | null, gradeId?: string) => {
  if (!gradeId) return undefined;

  const api = initializeApi(session);

  return api
    .get<Grade>(`/education/admin/grades/${gradeId}`)
    .then((response) => response.data);
};

export const useShowGrade = (session?: Session | null, gradeId?: string) => {
  const key = useMemo(
    () => gradesKeys.show(JSON.stringify({ gradeId })),
    [gradeId]
  );

  return useQuery(key, () => showGrade(session, gradeId));
};
