import { QueryObserverOptions, useQuery } from 'react-query';

import { Multigrade } from 'models/Multigrade';

import { createUnstableApi } from 'services/api';

export const multigradesKeys = {
  all: 'multigrades' as const,
  lists: () => [...multigradesKeys.all, 'list'],
  list: (filters: string) => [...multigradesKeys.lists(), { filters }],
  shows: () => [...multigradesKeys.all, 'show'],
  show: (filters: string) => [...multigradesKeys.shows(), { filters }]
};

export type ListMultigradesFilters = {
  school_id?: string;
  class_period_id?: string;
};

export const listMultigrades = (
  filters: ListMultigradesFilters,
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<Multigrade[]>(`/multigrades`, { params: filters })
    .then((response) => response.data);
};

export const useListMultigrades = (filters: ListMultigradesFilters = {}) => {
  return useQuery(multigradesKeys.list(JSON.stringify(filters)), () =>
    listMultigrades(filters)
  );
};

export type ShowMultigradeFilters = {
  multigrade_id?: string;
};

export const showMultigrade = async (
  filters: ShowMultigradeFilters,
  session?: AppSession
) => {
  const { multigrade_id } = filters;
  if (!multigrade_id) return undefined;

  const api = createUnstableApi(session);
  const response = await api
    .get<Multigrade>(`/multigrades/${multigrade_id}`)
    .then((response) => response.data);

  return response;
};

export const useShowMultigrade = (
  filters: ShowMultigradeFilters = {},
  queryOptions: QueryObserverOptions<Multigrade | undefined> = {}
) => {
  return useQuery<Multigrade | undefined>(
    multigradesKeys.show(JSON.stringify(filters)),
    () => showMultigrade(filters),
    queryOptions
  );
};
