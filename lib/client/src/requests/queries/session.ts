import { useQuery } from 'react-query';

import { SchoolYear } from 'models/SchoolYear';
import {
  ProfileWithSchool,
  SessionAccess,
  UserWithEmployee
} from 'models/Session';

import { queryClient, unstable__api } from 'services/api';
import { isServer } from 'utils/isServer';

const BASE_URL = isServer
  ? process.env.APP_URL_INTERNAL
  : process.env.NEXT_PUBLIC_APP_URL;

const QUERY_CONFIG = {
  refetchInterval: 20000,
  refetchOnReconnect: true,
  refetchOnWindowFocus: true
};

export const SESSION_KEYS = {
  all: ['sessions'] as const,
  user: () => [...SESSION_KEYS.all, 'user'] as const,
  accessModules: () => [...SESSION_KEYS.all, 'accessModules'] as const,
  profile: () => [...SESSION_KEYS.all, 'profile'] as const,
  schoolYear: () => [...SESSION_KEYS.all, 'schoolYear'] as const
} as const;

export const getSession = () => {
  return unstable__api
    .get<{ token?: string }>(`${BASE_URL}/api/session`)
    .then((response) => response.data)
    .catch(() => undefined);
};

export const fetchSession = () => {
  return queryClient.fetchQuery([...SESSION_KEYS.all], () => getSession());
};

export const useSession = () => {
  return useQuery([...SESSION_KEYS.all], () => getSession(), QUERY_CONFIG);
};

export const getUser = () => {
  return unstable__api
    .get<UserWithEmployee>(`${BASE_URL}/api/session/user`)
    .then((response) => response.data)
    .catch(() => undefined);
};

export const fetchUser = () => {
  return queryClient.fetchQuery([...SESSION_KEYS.user()], () => getUser());
};

export const useUser = () => {
  return useQuery([...SESSION_KEYS.user()], () => getUser(), QUERY_CONFIG);
};

export const getAccessModules = () => {
  return unstable__api
    .get<SessionAccess[]>(`${BASE_URL}/api/session/access-modules`)
    .then((response) => response.data)
    .catch(() => []);
};

export const fetchAccessModules = () => {
  return queryClient.fetchQuery([...SESSION_KEYS.accessModules()], () =>
    getAccessModules()
  );
};

export const useAccessModules = () => {
  return useQuery(
    [...SESSION_KEYS.accessModules()],
    () => getAccessModules(),
    QUERY_CONFIG
  );
};

export const getProfile = () => {
  return unstable__api
    .get<ProfileWithSchool>(`${BASE_URL}/api/session/profile`)
    .then((response) => response.data)
    .catch(() => undefined);
};

export const fetchProfile = () => {
  return queryClient.fetchQuery([...SESSION_KEYS.profile()], () =>
    getProfile()
  );
};

export const useProfile = () => {
  return useQuery(
    [...SESSION_KEYS.profile()],
    () => getProfile(),
    QUERY_CONFIG
  );
};

export const getSessionSchoolYear = () => {
  return unstable__api
    .get<SchoolYear>(`${BASE_URL}/api/session/school-year`)
    .then((response) => response.data)
    .catch(() => undefined);
};

export const fetchSessionSchoolYear = () => {
  return queryClient.fetchQuery([...SESSION_KEYS.schoolYear()], () =>
    getSessionSchoolYear()
  );
};

export const useSessionSchoolYear = () => {
  return useQuery(
    [...SESSION_KEYS.schoolYear()],
    () => getSessionSchoolYear(),
    QUERY_CONFIG
  );
};

export const fetchAllSession = async () => {
  await queryClient.invalidateQueries([SESSION_KEYS.all]);

  return Promise.all([
    fetchUser(),
    fetchSession(),
    fetchAccessModules(),
    fetchProfile(),
    fetchSessionSchoolYear()
  ]);
};
