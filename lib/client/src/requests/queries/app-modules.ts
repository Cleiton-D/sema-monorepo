import { useQuery } from 'react-query';

import { AppModule } from 'models/AppModule';

import { createUnstableApi } from 'services/api';

export const listAppModules = (session?: AppSession) => {
  const api = createUnstableApi(session);

  return api.get<AppModule[]>('/app/modules').then((response) => response.data);
};

export const useListAppModules = () => {
  const key = 'list-app-modules';

  const result = useQuery(key, () => listAppModules());

  return { ...result, key };
};
