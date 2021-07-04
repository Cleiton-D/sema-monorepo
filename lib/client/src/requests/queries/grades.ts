import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { Grade } from 'models/Grade';
import { initializeApi } from 'services/api';

type CountGradesResponse = {
  count: number;
};

export const listGrades = (session?: Session | null) => {
  const api = initializeApi(session);

  return api
    .get<Grade[]>('/education/admin/grades')
    .then((response) => response.data);
};

export const gradesCount = (session?: Session | null) => {
  const api = initializeApi(session);

  return api
    .get<CountGradesResponse>('/education/admin/grades/count')
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useListGrades = (session?: Session | null) => {
  return useQuery('get-grades', () => listGrades(session));
};

export const useGradesCount = (session?: Session | null) => {
  const key = `grades-count`;
  const result = useQuery(key, () => gradesCount(session));

  return { ...result, key };
};
