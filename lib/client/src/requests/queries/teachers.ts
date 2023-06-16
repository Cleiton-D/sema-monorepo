import { useQuery } from 'react-query';

import { Employee } from 'models/Employee';

import { createUnstableApi } from 'services/api';

type ListTeachersFilter = {
  school_id?: string;
};

export const listTeachers = async (
  filters: ListTeachersFilter = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<Employee[]>('/teachers', { params: filters })
    .then((response) => response.data);
};

export const useListTeachers = (filters: ListTeachersFilter = {}) => {
  const key = `list-teachers-${JSON.stringify(filters)}`;

  const result = useQuery(key, () => listTeachers(filters));

  return { ...result, key };
};
