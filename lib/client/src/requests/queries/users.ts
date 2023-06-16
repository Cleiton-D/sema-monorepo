import { useQuery } from 'react-query';

import { User, FormattedUser } from 'models/User';

import { createUnstableApi } from 'services/api';

import { userMapper } from 'utils/mappers/userMapper';

type CountUsersResponse = {
  count: number;
};

export const listUsers = (session?: AppSession): Promise<FormattedUser[]> => {
  const api = createUnstableApi(session);

  return api
    .get<User[]>('/users')
    .then((response) => response.data.map(userMapper));
};

export const countUsers = (session?: AppSession) => {
  const api = createUnstableApi(session);

  return api
    .get<CountUsersResponse>('/users/count')
    .then((response) => response.data);
};

export const useCountUsers = () => {
  const key = `count-users`;
  const result = useQuery(key, () => countUsers());

  return { ...result, key };
};
