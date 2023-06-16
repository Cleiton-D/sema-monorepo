import { useQuery } from 'react-query';

import { UserProfile } from 'models/UserProfile';

import { createUnstableApi } from 'services/api';

type ListUserProfilesFilters = {
  user_id?: string;
};

export const listUserProfiles = (
  filters: ListUserProfilesFilters,
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<UserProfile[]>('/user-profiles', { params: filters })
    .then((response) => response.data);
};

export const useListUserProfiles = (filters: ListUserProfilesFilters) => {
  const key = `list-profiles-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => listUserProfiles(filters));

  return { ...result, key };
};
