import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { Class } from 'models/Class';

import { initializeApi } from 'services/api';

import { classMapper } from 'utils/mappers/classMapper';

export const showClass = (session: Session | null, id?: string) => {
  if (!id) return undefined;

  const api = initializeApi(session);
  return api
    .get<Class>(`/classes/${id}`)
    .then((response) => classMapper(response.data));
};

export const useShowClass = (session: Session | null, id?: string) => {
  const key = `show-class-${id}`;
  const result = useQuery(key, () => showClass(session, id));

  return { ...result, key };
};

type ListClassesFilters = {
  classroom_id?: string;
  school_subject_id?: string;
  employee_id?: string;
};
export const listClasses = async (
  session: Session | null,
  filters: ListClassesFilters = {}
) => {
  const api = initializeApi(session);

  const classes = await api
    .get<Class[]>('/classes', { params: filters })
    .then((response) => response.data);

  return classes ? classes.map(classMapper) : [];
};

export const useListClasses = (
  session: Session | null,
  filters: ListClassesFilters
) => {
  const key = `list-classes-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => listClasses(session, filters));

  return { ...result, key };
};

type CountClassesResponse = {
  count: number;
};
export const countClasses = async (
  session: Session | null,
  filters: ListClassesFilters = {}
) => {
  const api = initializeApi(session);

  return api
    .get<CountClassesResponse>('/classes/count', { params: filters })
    .then((response) => response.data);
};

export const useCountClasses = (
  session: Session | null,
  filters: ListClassesFilters
) => {
  const key = `count-classes-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => countClasses(session, filters));

  return { ...result, key };
};
