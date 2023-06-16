import { useQuery } from 'react-query';

import { AccessLevel } from 'models/AccessLevel';
import { createUnstableApi } from 'services/api';

export const listAccessLevels = (session?: AppSession) => {
  const api = createUnstableApi(session);

  return api
    .get<AccessLevel[]>('/app/access-levels')
    .then((response) => response.data);
};

export const useListAccessLevels = () => {
  return useQuery('get-access-levels', () => listAccessLevels());
};
