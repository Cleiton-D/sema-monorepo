import { AppModule } from 'models/AppModule';
import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { initializeApi } from 'services/api';

export const listAppModules = (session: Session | null) => {
  const api = initializeApi(session);

  return api.get<AppModule[]>('/app/modules').then((response) => response.data);
};

export const useListAppModules = (session: Session | null) => {
  const key = 'list-app-modules';

  const result = useQuery(key, () => listAppModules(session));

  return { ...result, key };
};
