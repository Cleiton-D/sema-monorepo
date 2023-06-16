import { useQuery } from 'react-query';

import { SystemBackground } from 'models/SystemBackground';

import { createUnstableApi } from 'services/api';

export const systemBackgroundKeys = {
  all: 'system-backgrounds' as const,
  lists: () => [...systemBackgroundKeys.all, 'list'],
  list: (filters: string) => [...systemBackgroundKeys.lists(), { filters }],
  shows: () => [...systemBackgroundKeys.all, 'show'],
  show: (filters: string) => [...systemBackgroundKeys.shows(), { filters }]
};

export const listSystemBackgrounds = (session?: AppSession) => {
  const api = createUnstableApi(session);

  return api
    .get<SystemBackground[]>(`/admin/background`)
    .then(({ data }) => data)
    .catch(() => []);
};

export const useListSystemBackgrounds = () => {
  const key = systemBackgroundKeys.list(``);
  return useQuery(key, () => listSystemBackgrounds());
};
