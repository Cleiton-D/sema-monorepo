import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { SchoolTeacher } from 'models/SchoolTeacher';

import { initializeApi } from 'services/api';

type SchoolTeachersFilters = {
  school_id?: string;
};

type CountSchoolTeachersResponse = {
  count: number;
};

export const listSchoolTeachers = (
  session: Session | null,
  filters: SchoolTeachersFilters
) => {
  const api = initializeApi(session);

  const { school_id, ...params } = filters;

  if (!school_id) return [];

  return api
    .get<SchoolTeacher[]>(`/schools/${school_id}/teachers`, { params })
    .then((response) => response.data);
};

export const useListSchoolTeachers = (
  session: Session | null,
  filters: SchoolTeachersFilters
) => {
  const key = `list-school-teachers-${JSON.stringify(filters)}`;

  const result = useQuery(key, () => listSchoolTeachers(session, filters));

  return { ...result, key };
};

export const countSchoolTeachers = (
  session: Session | null,
  filters: SchoolTeachersFilters
) => {
  const api = initializeApi(session);

  const { school_id, ...params } = filters;

  if (!school_id) return { count: 0 };

  return api
    .get<CountSchoolTeachersResponse>(`/schools/${school_id}/teachers/count`, {
      params
    })
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useCountSchoolTeachers = (
  session: Session | null,
  filters: SchoolTeachersFilters
) => {
  const key = `count-school-teachers-${JSON.stringify(filters)}`;

  const result = useQuery(key, () => countSchoolTeachers(session, filters));

  return { ...result, key };
};
