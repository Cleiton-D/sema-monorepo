import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { Branch } from 'models/Branch';

import { initializeApi } from 'services/api';

type ShowBranchFilters = {
  branch_id?: string;
  type?: string;
};

export const showBranch = (
  session: Session | null,
  filters: ShowBranchFilters
) => {
  const api = initializeApi(session);

  const { branch_id, ...params } = filters;
  if (!branch_id && Object.keys(params).length === 0) return undefined;

  return api
    .get<Branch>(`/app/branchs/${branch_id || 'show'}`, { params })
    .then((response) => response.data);
};

export const useShowBranch = (
  session: Session | null,
  filters: ShowBranchFilters
) => {
  const key = `show-branch-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => showBranch(session, filters));

  return { ...result, key };
};

export const listBranchs = (session: Session | null) => {
  const api = initializeApi(session);

  return api.get<Branch[]>('/app/branchs').then((response) => response.data);
};

export const useListBranchs = (session: Session | null) => {
  const key = `list-branchs`;
  const result = useQuery(key, () => listBranchs(session));

  return { ...result, key };
};
