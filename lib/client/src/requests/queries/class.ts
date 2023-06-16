import { QueryObserverOptions, useQuery } from 'react-query';

import { Class, FormattedClass } from 'models/Class';

import { createUnstableApi } from 'services/api';

import { classMapper } from 'utils/mappers/classMapper';
import { PaginatedHttpResponse } from 'models/app';
import { SchoolTerm } from 'models/SchoolTerm';

export const classesKeys = {
  all: 'classes' as const,
  lists: () => [...classesKeys.all, 'list'],
  list: (filters: string) => [...classesKeys.lists(), { filters }],
  shows: () => [...classesKeys.all, 'show'],
  show: (filters: string) => [...classesKeys.shows(), { filters }],
  counts: () => [...classesKeys.all, 'count'],
  count: (filters: string) => [...classesKeys.counts(), { filters }]
};

export const showClass = (id?: string, session?: AppSession) => {
  if (!id) return undefined;

  const api = createUnstableApi(session);
  return api
    .get<Class>(`/classes/${id}`)
    .then((response) => classMapper(response.data));
};

export const useShowClass = (id?: string) => {
  const key = classesKeys.show(JSON.stringify({ id }));
  const result = useQuery(key, () => showClass(id));

  return { ...result, key };
};

export type ListClassesFilters = {
  classroom_id?: string;
  school_subject_id?: string;
  employee_id?: string;
  school_id?: string;
  class_date?: string;
  class_period_id?: string;
  school_year_id?: string;
  grade_id?: string;
  status?: string;
  taught_content?: string;
  school_term?: SchoolTerm;
  limit?: number;
  sortBy?: string;
  order?: 'DESC' | 'ASC';
  before?: string;
  page?: number;
  size?: number;
};
export const listClasses = async (
  filters: ListClassesFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  const response = await api
    .get<PaginatedHttpResponse<Class>>('/classes', { params: filters })
    .then((response) => response.data);

  if (!response) return undefined;

  const mappedClasses = response.items.map(classMapper);

  return { ...response, items: mappedClasses };
};

export const useListClasses = (
  filters: ListClassesFilters,
  queryOptions: QueryObserverOptions<
    PaginatedHttpResponse<FormattedClass> | undefined
  > = {}
) => {
  const key = classesKeys.list(JSON.stringify(filters));
  const result = useQuery<PaginatedHttpResponse<FormattedClass> | undefined>(
    key,
    () => listClasses(filters),
    queryOptions
  );

  return { ...result, key };
};

type CountClassesResponse = {
  count: number;
};
export const countClasses = async (
  filters: ListClassesFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<CountClassesResponse>('/classes/count', { params: filters })
    .then((response) => response.data);
};

export const useCountClasses = (filters: ListClassesFilters) => {
  const key = classesKeys.count(JSON.stringify(filters));
  const result = useQuery(key, () => countClasses(filters));

  return { ...result, key };
};
