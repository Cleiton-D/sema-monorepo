import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { Employee } from 'models/Employee';

import { initializeApi } from 'services/api';

export const listTeachers = async (session?: Session | null) => {
  const api = initializeApi(session);

  return api.get<Employee[]>('/teachers').then((response) => response.data);
};

export const useListTeachers = (session?: Session | null) => {
  const key = `list-teachers`;

  const result = useQuery(key, () => listTeachers(session));

  return { ...result, key };
};
