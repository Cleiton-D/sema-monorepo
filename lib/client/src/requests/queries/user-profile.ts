import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { UserProfile } from 'models/UserProfile';

import { initializeApi } from 'services/api';

type ListUserProfilesFilters = {
  user_id?: string;
};

export const listUserProfiles = (
  session: Session | null,
  filters: ListUserProfilesFilters
) => {
  const api = initializeApi(session);

  return api
    .get<UserProfile[]>('/user-profiles', { params: filters })
    .then((response) => response.data);
};

export const useListUserProfiles = (
  session: Session | null,
  filters: ListUserProfilesFilters
) => {
  const key = `list-profiles-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => listUserProfiles(session, filters));

  return { ...result, key };
};
