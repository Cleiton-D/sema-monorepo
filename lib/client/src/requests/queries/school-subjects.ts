import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { SchoolSubject } from 'models/SchoolSubject';

import { initializeApi } from 'services/api';

type ListSchoolSubjectsFilters = {
  grade_id?: string | 'all';
  school_year_id?: string;
};

export const listSchoolSubjects = (
  session?: Session | null,
  filters: ListSchoolSubjectsFilters = {}
) => {
  const api = initializeApi(session);

  return api
    .get<SchoolSubject[]>('/education/admin/school-subjects', {
      params: filters
    })
    .then((response) => response.data);
};

export const useListSchoolsSubjects = (
  session?: Session | null,
  filters: ListSchoolSubjectsFilters = {}
) => {
  const key = `get-school-subjects-${JSON.stringify(filters)}`;

  const result = useQuery(key, () => listSchoolSubjects(session, filters));

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
