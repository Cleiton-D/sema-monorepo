import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { Employee } from 'models/Employee';

import { initializeApi } from 'services/api';

type ListTeachersFilter = {
  school_id?: string;
};

export const listTeachers = async (
  session?: Session | null,
  filters: ListTeachersFilter = {}
) => {
  const api = initializeApi(session);

  return api
    .get<Employee[]>('/teachers', { params: filters })
    .then((response) => response.data);
};

export const useListTeachers = (
  session?: Session | null,
  filters: ListTeachersFilter = {}
) => {
  const key = `list-teachers-${JSON.stringify(filters)}`;

  const result = useQuery(key, () => listTeachers(session, filters));

  return { ...result, key };
};
