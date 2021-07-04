import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { Enroll } from 'models/Enroll';

import { initializeApi } from 'services/api';

type EnrollFilters = {
  classroom_id?: string;
  school_id?: string;
  grade_id?: string;
};

type CountEnrollsResponse = {
  count: number;
};

export const listEnrolls = (
  session?: Session | null,
  filters: EnrollFilters = {}
) => {
  const api = initializeApi(session);

  return api
    .get<Enroll[]>('/enrolls', { params: filters })
    .then((response) => response.data);
};

export const getEnrollDetails = (
  enroll_id: string,
  session: Session | null
) => {
  const api = initializeApi(session);

  const enroll = api
    .get<Enroll>(`/enrolls/${enroll_id}`)
    .then((response) => response.data);

  return enroll;
};

export const enrollCount = (
  session?: Session | null,
  filters: EnrollFilters = {}
) => {
  const api = initializeApi(session);
  return api
    .get<CountEnrollsResponse>('/enrolls/count', { params: filters })
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useListEnrolls = (
  session?: Session | null,
  filters: EnrollFilters = {}
) => {
  const key = `list-enrolls-${JSON.stringify(filters)}`;

  const result = useQuery(key, () => listEnrolls(session, filters));
  return { ...result, key };
};

export const useGetEnrollDetails = (
  enroll_id: string,
  session: Session | null
) => {
  const key = `get-enroll-${enroll_id}`;

  const result = useQuery(key, () => getEnrollDetails(enroll_id, session));

  return { ...result, key };
};

export const useEnrollCount = (
  session?: Session | null,
  filters: EnrollFilters = {}
) => {
  const key = `enroll-count-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => enrollCount(session, filters));

  return { ...result, key };
};
