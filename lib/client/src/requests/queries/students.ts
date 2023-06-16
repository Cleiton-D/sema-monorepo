import { useQuery } from 'react-query';

import { Student } from 'models/Student';

import { createUnstableApi } from 'services/api';

export type StudentsFilters = {
  name?: string;
};

export const listStudents = (
  filters: StudentsFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<Student[]>('/students', { params: filters })
    .then((response) => response.data)
    .catch(() => []);
};

export const useListStudents = (filters: StudentsFilters = {}) => {
  const key = JSON.stringify(`list-students-${JSON.stringify(filters)}`);
  const result = useQuery(key, () => listStudents(filters));

  return { ...result, key };
};

export const getStudent = (id: string, session?: AppSession) => {
  const api = createUnstableApi(session);

  return api.get<Student>(`/students/${id}`).then((response) => response.data);
};
