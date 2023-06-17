import { useMemo } from 'react';
import { QueryObserverOptions, useQuery } from 'react-query';

import { AccessModule } from 'models/AccessModule';

import { createUnstableApi } from 'services/api';

export const acessModulesKeys = {
  all: 'acess-modules' as const,
  lists: () => [...acessModulesKeys.all, 'list'],
  list: (filters: string) => [...acessModulesKeys.lists(), { filters }]
};

type ListAccessModulesFilters = {
  access_level_id?: string;
};

export const listAccessModules = (
  filters: ListAccessModulesFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<AccessModule[]>('/app/access-modules', { params: filters })
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useListAccessModules = (
  filters: ListAccessModulesFilters = {},
  queryOptions: QueryObserverOptions<AccessModule[] | undefined> = {}
) => {
  const key = useMemo(
    () => acessModulesKeys.list(JSON.stringify({ ...filters })),
    [filters]
  );

  const result = useQuery<AccessModule[] | undefined>(
    key,
    () => listAccessModules(filters),
    queryOptions
  );

  return { ...result, key };
};
