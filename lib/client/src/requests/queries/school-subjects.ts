import { QueryObserverOptions, useQuery } from 'react-query';

import { SchoolSubject } from 'models/SchoolSubject';

import { createUnstableApi } from 'services/api';

type ListSchoolSubjectsFilters = {
  grade_id?: string | 'all';
  school_year_id?: string;
  include_multidisciplinary?: boolean;
  is_multidisciplinary?: boolean;
};

export const listSchoolSubjects = (
  filters: ListSchoolSubjectsFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

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
  filters: ListSchoolSubjectsFilters = {},
  queryOptions: QueryObserverOptions<SchoolSubject[]> = {}
) => {
  const key = `get-school-subjects-${JSON.stringify(filters)}`;

  const result = useQuery<SchoolSubject[]>(
    key,
    () => listSchoolSubjects(filters),
    queryOptions
  );

  return { ...result, key };
};

export const showSchoolSubject = (id: string, session?: AppSession) => {
  const api = createUnstableApi(session);

  return api
    .get<SchoolSubject>(`/education/admin/school-subjects/${id}`)
    .then((response) => response.data);
};

export const useShowSchoolSubject = (id: string) => {
  const key = `show-school-subject-${id}`;

  const result = useQuery(key, () => showSchoolSubject(id));
  return { ...result, key };
};

type CountSchoolSubjectsResponse = {
  count: number;
};
export const countSchoolSubjects = (
  filters: CountSchoolSubjectsFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<CountSchoolSubjectsResponse>(
      `/education/admin/school-subjects/count`,
      { params: filters }
    )
    .then((response) => response.data)
    .catch(() => undefined);
};

type CountSchoolSubjectsFilters = {
  school_year_id?: string;
};

export const useCountSchoolSubjects = (
  filters: CountSchoolSubjectsFilters = {}
) => {
  const key = `count-school-subjects-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => countSchoolSubjects(filters));

  return { ...result, key };
};
