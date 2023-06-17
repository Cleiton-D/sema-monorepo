import { useQuery } from 'react-query';

import { SchoolTeacher } from 'models/SchoolTeacher';

import { createUnstableApi } from 'services/api';

type SchoolTeachersFilters = {
  school_id?: string;
  school_year_id?: string;
};

type CountSchoolTeachersResponse = {
  count: number;
};

export const listSchoolTeachers = (
  filters: SchoolTeachersFilters,
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  const { school_id, ...params } = filters;

  if (!school_id) return [];

  return api
    .get<SchoolTeacher[]>(`/schools/${school_id}/teachers`, { params })
    .then((response) => response.data);
};

export const useListSchoolTeachers = (filters: SchoolTeachersFilters) => {
  const key = `list-school-teachers-${JSON.stringify(filters)}`;

  const result = useQuery(key, () => listSchoolTeachers(filters));

  return { ...result, key };
};

export const countSchoolTeachers = (
  filters: SchoolTeachersFilters,
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  const { school_id, ...params } = filters;

  if (!school_id) return { count: 0 };

  return api
    .get<CountSchoolTeachersResponse>(`/schools/${school_id}/teachers/count`, {
      params
    })
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useCountSchoolTeachers = (filters: SchoolTeachersFilters) => {
  const key = `count-school-teachers-${JSON.stringify(filters)}`;

  const result = useQuery(key, () => countSchoolTeachers(filters));

  return { ...result, key };
};
