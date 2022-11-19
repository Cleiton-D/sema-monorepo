import { useMemo } from 'react';
import { Session } from 'next-auth';
import { useQuery, QueryObserverOptions } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import { Classroom } from 'models/Classroom';
import { PaginatedHttpResponse } from 'models/app';

import { initializeApi } from 'services/api';

export const classroomsKeys = {
  all: 'classrooms' as const,
  lists: () => [...classroomsKeys.all, 'list'] as const,
  list: (filters: string) => [...classroomsKeys.lists(), { filters }] as const,
  shows: () => [...classroomsKeys.all, 'show'] as const,
  show: (filters: string) => [...classroomsKeys.lists(), { filters }] as const
};

export const addClassroomQueryMutation = (
  old: Classroom[],
  newItem: Classroom
) => [...old, { ...newItem, uuid: uuidv4(), disabled: true }];

export const deleteClassroomQueryMutation = (
  old: Classroom[] | null,
  removed: Classroom
) => {
  if (!old) return old;

  return old.map((item) =>
    item.id === removed.id ? { ...item, disabled: true } : item
  );
};

export type ListClassroomsFilters = {
  school_id?: string;
  grade_id?: string;
  class_period_id?: string;
  employee_id?: string;
  with_in_multigrades?: boolean | number;
  with_multigrades?: boolean | number;
  page?: number;
  size?: number;
};

export const listClassrooms = (
  session: Session | null,
  filters: ListClassroomsFilters = {}
) => {
  const api = initializeApi(session);

  const { ...params } = filters;
  if (typeof filters.with_in_multigrades !== 'undefined') {
    params.with_in_multigrades = Number(filters.with_in_multigrades);
  }
  if (typeof filters.with_multigrades !== 'undefined') {
    params.with_multigrades = Number(filters.with_multigrades);
  }

  return api
    .get<PaginatedHttpResponse<Classroom>>(`/classrooms`, { params })
    .then((response) => response.data);
};

export const useListClassrooms = (
  session: Session | null,
  filters: ListClassroomsFilters = {},
  queryOptions: QueryObserverOptions<PaginatedHttpResponse<Classroom>> = {}
) => {
  const key = useMemo(
    () => classroomsKeys.list(JSON.stringify(filters)),
    [filters]
  );

  const result = useQuery<PaginatedHttpResponse<Classroom>>(
    key,
    () => listClassrooms(session, filters),
    queryOptions
  );

  return {
    ...result,
    key,
    queryAddMutation: addClassroomQueryMutation,
    queryRemoveMutation: deleteClassroomQueryMutation
  };
};

type ShowClassroomFilters = {
  id: string;
};
export const showClassroom = (
  session: Session | null,
  filters: ShowClassroomFilters
) => {
  const api = initializeApi(session);
  const { id } = filters;

  return api
    .get<Classroom>(`/classrooms/${id}`)
    .then((response) => response.data);
};

export const useShowClassroom = (
  session: Session | null,
  filters: ShowClassroomFilters,
  queryOptions: QueryObserverOptions<Classroom> = {}
) => {
  const key = useMemo(
    () => classroomsKeys.show(JSON.stringify(filters)),
    [filters]
  );

  const result = useQuery<Classroom>(
    key,
    () => showClassroom(session, filters),
    queryOptions
  );
  return { ...result, key };
};

type CountClassroomsResponse = {
  count: number;
};
export const countClassrooms = (
  session: Session | null,
  params: ListClassroomsFilters = {}
) => {
  const api = initializeApi(session);

  return api
    .get<CountClassroomsResponse>(`/classrooms/count`, { params })
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useCountClassrooms = (
  session: Session | null,
  filters: ListClassroomsFilters = {}
) => {
  const key = `count-classrooms-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => countClassrooms(session, filters));

  return { ...result, key };
};
