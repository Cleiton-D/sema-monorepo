import { useQuery } from 'react-query';

import { Branch } from 'models/Branch';

import { createUnstableApi } from 'services/api';

type ShowBranchFilters = {
  branch_id?: string;
  type?: string;
};

export const showBranch = (
  filters: ShowBranchFilters,
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  const { branch_id, ...params } = filters;
  if (!branch_id && Object.keys(params).length === 0) return undefined;

  return api
    .get<Branch>(`/app/branchs/${branch_id || 'show'}`, { params })
    .then((response) => response.data);
};

export const useShowBranch = (filters: ShowBranchFilters) => {
  const key = `show-branch-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => showBranch(filters));

  return { ...result, key };
};

export const listBranchs = (session?: AppSession) => {
  const api = createUnstableApi(session);

  return api.get<Branch[]>('/app/branchs').then((response) => response.data);
};

export const useListBranchs = () => {
  const key = `list-branchs`;
  const result = useQuery(key, () => listBranchs());

  return { ...result, key };
};
