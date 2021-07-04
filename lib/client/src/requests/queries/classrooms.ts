import { Session } from 'next-auth';
import { useQuery } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import { Classroom } from 'models/Classroom';

import { initializeApi } from 'services/api';

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

type ListClassroomsFilters = {
  school_id?: string;
  grade_id?: string;
  class_period_id?: string;
};

export const listClassrooms = (
  session: Session | null,
  filters: ListClassroomsFilters = {}
) => {
  const api = initializeApi(session);

  const { school_id, ...params } = filters;

  return api
    .get<Classroom[]>(`/schools/${school_id || 'me'}/classrooms`, { params })
    .then((response) => response.data);
};

export const useListClassrooms = (
  session: Session | null,
  filters: ListClassroomsFilters = {}
) => {
  const key = `list-classrooms-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => listClassrooms(session, filters));

  return {
    ...result,
    key,
    queryAddMutation: addClassroomQueryMutation,
    queryRemoveMutation: deleteClassroomQueryMutation
  };
};

type ShowClassroomFilters = {
  school_id?: string;
  id: string;
};
export const showClassroom = (
  session: Session | null,
  filters: ShowClassroomFilters
) => {
  const api = initializeApi(session);
  const { school_id, id } = filters;

  return api
    .get<Classroom>(`/schools/${school_id || 'me'}/classrooms/${id}`)
    .then((response) => response.data);
};

export const useShowClassroom = (
  session: Session | null,
  filters: ShowClassroomFilters
) => {
  const key = `show-classroom-${JSON.stringify(filters)}`;

  const result = useQuery(key, () => showClassroom(session, filters));
  return { ...result, key };
};

type CountClassroomsResponse = {
  count: number;
};
export const countClassrooms = (
  session: Session | null,
  filters: ListClassroomsFilters = {}
) => {
  const api = initializeApi(session);
  const { school_id, ...params } = filters;

  return api
    .get<CountClassroomsResponse>(
      `/schools/${school_id || 'me'}/classrooms/count`,
      { params }
    )
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
