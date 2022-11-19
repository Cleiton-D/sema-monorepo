import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { SystemBackground } from 'models/SystemBackground';

import { initializeApi } from 'services/api';

export const systemBackgroundKeys = {
  all: 'system-backgrounds' as const,
  lists: () => [...systemBackgroundKeys.all, 'list'],
  list: (filters: string) => [...systemBackgroundKeys.lists(), { filters }],
  shows: () => [...systemBackgroundKeys.all, 'show'],
  show: (filters: string) => [...systemBackgroundKeys.shows(), { filters }]
};

export const listSystemBackgrounds = (session: Session | null) => {
  const api = initializeApi(session);

  return api
    .get<SystemBackground[]>(`/admin/background`)
    .then(({ data }) => data)
    .catch(() => []);
};

export const useListSystemBackgrounds = (session: Session | null) => {
  const key = systemBackgroundKeys.list(``);
  return useQuery(key, () => listSystemBackgrounds(session));
};
