import { useMemo } from 'react';
import { Session } from 'next-auth';
import { QueryObserverOptions, useQuery } from 'react-query';

import { AccessModule } from 'models/AccessModule';

import { initializeApi } from 'services/api';

export const acessModulesKeys = {
  all: 'acess-modules' as const,
  lists: () => [...acessModulesKeys.all, 'list'],
  list: (filters: string) => [...acessModulesKeys.lists(), { filters }]
};

type ListAccessModulesFilters = {
  access_level_id?: string;
};

export const listAccessModules = (
  session: Session | null,
  filters: ListAccessModulesFilters = {}
) => {
  const api = initializeApi(session);

  return api
    .get<AccessModule[]>('/app/access-modules', { params: filters })
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useListAccessModules = (
  session: Session | null,
  filters: ListAccessModulesFilters = {},
  queryOptions: QueryObserverOptions<AccessModule[] | undefined> = {}
) => {
  const key = useMemo(
    () =>
      acessModulesKeys.list(
        JSON.stringify({ ...filters, token: session?.jwt })
      ),
    [filters, session]
  );

  const result = useQuery<AccessModule[] | undefined>(
    key,
    () => listAccessModules(session, filters),
    queryOptions
  );

  return { ...result, key };
};
