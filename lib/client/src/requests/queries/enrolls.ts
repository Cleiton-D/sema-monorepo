import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { PaginatedHttpResponse } from 'models/app';
import { Enroll, EnrollStatus } from 'models/Enroll';

import { initializeApi } from 'services/api';
import { useMemo } from 'react';

export type EnrollFilters = {
  classroom_id?: string;
  school_id?: string;
  grade_id?: string;
  class_period_id?: string;
  page?: number;
  size?: number;
  status?: EnrollStatus;
};

type CountEnrollsResponse = {
  count: number;
};

export const enrollsKeys = {
  all: 'enrolls' as const,
  lists: () => [...enrollsKeys.all, 'list'] as const,
  list: (filters: string) => [...enrollsKeys.lists(), { filters }] as const,
  counts: () => [...enrollsKeys.all, 'count'] as const,
  count: (filters: string) => [...enrollsKeys.counts(), { filters }] as const,
  shows: () => [...enrollsKeys.all, 'show'] as const,
  show: (filters?: string) => [...enrollsKeys.shows(), { filters }] as const
};

export const listEnrolls = (
  session?: Session | null,
  filters: EnrollFilters = {}
) => {
  const api = initializeApi(session);

  return api
    .get<PaginatedHttpResponse<Enroll>>('/enrolls', { params: filters })
    .then((response) => response.data);
};

export const getEnrollDetails = (
  enroll_id?: string,
  session?: Session | null
) => {
  if (!enroll_id) {
    return undefined;
  }

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
  const key = useMemo(
    () => enrollsKeys.list(JSON.stringify(filters)),
    [filters]
  );

  const result = useQuery(key, () => listEnrolls(session, filters));
  return { ...result, key };
};

export const useGetEnrollDetails = (
  enroll_id?: string,
  session?: Session | null
) => {
  const key = useMemo(() => enrollsKeys.show(enroll_id), [enroll_id]);

  const result = useQuery(key, () => getEnrollDetails(enroll_id, session));

  return { ...result, key };
};

export const useEnrollCount = (
  session?: Session | null,
  filters: EnrollFilters = {}
) => {
  const key = useMemo(
    () => enrollsKeys.count(JSON.stringify(filters)),
    [filters]
  );
  const result = useQuery(key, () => enrollCount(session, filters));

  return { ...result, key };
};
