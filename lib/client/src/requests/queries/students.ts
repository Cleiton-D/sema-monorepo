import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { Student } from 'models/Student';

import { initializeApi } from 'services/api';

export type StudentsFilters = {
  name?: string;
};

export const listStudents = (
  session?: Session | null,
  filters: StudentsFilters = {}
) => {
  const api = initializeApi(session);

  return api
    .get<Student[]>('/students', { params: filters })
    .then((response) => response.data)
    .catch(() => []);
};

export const useListStudents = (
  session?: Session | null,
  filters: StudentsFilters = {}
) => {
  const key = JSON.stringify(`list-students-${JSON.stringify(filters)}`);
  const result = useQuery(key, () => listStudents(session, filters));

  return { ...result, key };
};

export const getStudent = (session: Session | null, id: string) => {
  const api = initializeApi(session);

  return api.get<Student>(`/students/${id}`).then((response) => response.data);
};
