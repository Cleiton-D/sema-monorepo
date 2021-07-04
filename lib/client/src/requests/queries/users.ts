import { Session } from 'next-auth';

import { initializeApi } from 'services/api';
import { User, FormattedUser } from 'models/User';
import { userMapper } from 'utils/mappers/userMapper';

export const listUsers = (
  session?: Session | null
): Promise<FormattedUser[]> => {
  const api = initializeApi(session);

  return api
    .get<User[]>('/users')
    .then((response) => response.data.map(userMapper));
};
