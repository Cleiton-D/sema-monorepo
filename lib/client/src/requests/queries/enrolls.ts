import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { PaginatedHttpResponse } from 'models/app';
import { Enroll, EnrollStatus } from 'models/Enroll';

import { createUnstableApi } from 'services/api';

export type EnrollFilters = {
  classroom_id?: string;
  school_id?: string;
  grade_id?: string;
  class_period_id?: string;
  school_year_id?: string;
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
  filters: EnrollFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<PaginatedHttpResponse<Enroll>>('/enrolls', { params: filters })
    .then((response) => response.data);
};

export const getEnrollDetails = (enroll_id?: string, session?: AppSession) => {
  if (!enroll_id) {
    return undefined;
  }

  const api = createUnstableApi(session);

  const enroll = api
    .get<Enroll>(`/enrolls/${enroll_id}`)
    .then((response) => response.data);

  return enroll;
};

export const enrollCount = (
  filters: EnrollFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);
  return api
    .get<CountEnrollsResponse>('/enrolls/count', { params: filters })
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useListEnrolls = (filters: EnrollFilters = {}) => {
  const key = useMemo(
    () => enrollsKeys.list(JSON.stringify(filters)),
    [filters]
  );

  const result = useQuery(key, () => listEnrolls(filters));
  return { ...result, key };
};

export const useGetEnrollDetails = (enroll_id?: string) => {
  const key = useMemo(() => enrollsKeys.show(enroll_id), [enroll_id]);

  const result = useQuery(key, () => getEnrollDetails(enroll_id));

  return { ...result, key };
};

export const useEnrollCount = (filters: EnrollFilters = {}) => {
  const key = useMemo(
    () => enrollsKeys.count(JSON.stringify(filters)),
    [filters]
  );
  const result = useQuery(key, () => enrollCount(filters));

  return { ...result, key };
};
