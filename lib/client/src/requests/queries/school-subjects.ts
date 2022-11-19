import { Session } from 'next-auth';
import { QueryObserverOptions, useQuery } from 'react-query';

import { SchoolSubject } from 'models/SchoolSubject';

import { initializeApi } from 'services/api';

type ListSchoolSubjectsFilters = {
  grade_id?: string | 'all';
  school_year_id?: string;
  include_multidisciplinary?: boolean;
  is_multidisciplinary?: boolean;
};

export const listSchoolSubjects = (
  session?: Session | null,
  filters: ListSchoolSubjectsFilters = {}
) => {
  const api = initializeApi(session);

  const { include_multidisciplinary, is_multidisciplinary, ...restParams } =
    filters;
  const params = { ...restParams } as any;

  if (typeof include_multidisciplinary !== 'undefined') {
    params.include_multidisciplinary = Number(include_multidisciplinary);
  }

  if (typeof is_multidisciplinary !== 'undefined') {
    params.is_multidisciplinary = Number(is_multidisciplinary);
  }

  return api
    .get<SchoolSubject[]>('/education/admin/school-subjects', {
      params
    })
    .then((response) => response.data);
};

export const useListSchoolsSubjects = (
  session?: Session | null,
  filters: ListSchoolSubjectsFilters = {},
  queryOptions: QueryObserverOptions<SchoolSubject[]> = {}
) => {
  const key = `get-school-subjects-${JSON.stringify(filters)}`;

  const result = useQuery<SchoolSubject[]>(
    key,
    () => listSchoolSubjects(session, filters),
    queryOptions
  );

  return { ...result, key };
};

export const showSchoolSubject = (session: Session | null, id: string) => {
  const api = initializeApi(session);

  return api
    .get<SchoolSubject>(`/education/admin/school-subjects/${id}`)
    .then((response) => response.data);
};

export const useShowSchoolSubject = (session: Session | null, id: string) => {
  const key = `show-school-subject-${id}`;

  const result = useQuery(key, () => showSchoolSubject(session, id));
  return { ...result, key };
};

type CountSchoolSubjectsResponse = {
  count: number;
};
export const countSchoolSubjects = (session: Session | null) => {
  const api = initializeApi(session);

  return api
    .get<CountSchoolSubjectsResponse>(`/education/admin/school-subjects/count`)
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useCountSchoolSubjects = (session: Session | null) => {
  const key = `count-school-subjects`;
  const result = useQuery(key, () => countSchoolSubjects(session));

  return { ...result, key };
};
