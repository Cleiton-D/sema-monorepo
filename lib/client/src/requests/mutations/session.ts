import { unstable__api } from 'services/api';
import { isServer } from 'utils/isServer';

type CreateSessionParams = {
  email: string;
  password: string;
};

export const createSession = (params: CreateSessionParams) => {
  const baseURL = isServer
    ? process.env.APP_URL_INTERNAL
    : process.env.NEXT_PUBLIC_APP_URL;

  return unstable__api.post(`${baseURL}/api/session`, params);
};

type RefreshSessionParams = {
  profileId?: string;
  schoolYearId?: string;
};

export const refreshSession = (params: RefreshSessionParams) => {
  const baseURL = isServer
    ? process.env.APP_URL_INTERNAL
    : process.env.NEXT_PUBLIC_APP_URL;

  return unstable__api.put(`${baseURL}/api/session`, params);
};

export const destroySession = () => {
  const baseURL = isServer
    ? process.env.APP_URL_INTERNAL
    : process.env.NEXT_PUBLIC_APP_URL;

  return unstable__api.delete(`${baseURL}/api/session`);
};
