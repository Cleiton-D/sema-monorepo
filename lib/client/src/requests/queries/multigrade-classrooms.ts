import { MultigradeClassroom } from 'models/multigrade-classroom';

import { createUnstableApi } from 'services/api';
import { useQuery } from 'react-query';

export const multigradesClassroomsKeys = {
  all: 'multigrades-classrooms' as const,
  lists: () => [...multigradesClassroomsKeys.all, 'list'],
  list: (filters: string) => [...multigradesClassroomsKeys.lists(), { filters }]
};

export type ListMultigradeClassroomsFilters = {
  multigrade_id: string;
};

export const listMultigradeClassrooms = (
  filters: ListMultigradeClassroomsFilters,
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  const { multigrade_id } = filters;
  return api
    .get<MultigradeClassroom[]>(`/multigrades/${multigrade_id}/classrooms`)
    .then((response) => response.data);
};

export const useListMultigradeClassrooms = (
  filters: ListMultigradeClassroomsFilters
) => {
  return useQuery(multigradesClassroomsKeys.list(JSON.stringify(filters)), () =>
    listMultigradeClassrooms(filters)
  );
};
