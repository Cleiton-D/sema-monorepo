import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { initializeApi, queryClient } from 'services/api';
import { ClassPeriod, FormattedClassPeriod } from 'models/ClassPeriod';
import { classPeriodsMapper } from 'utils/mappers/classPeriodMapper';

export const queryKeys = {
  LIST_CLASS_PERIODS: 'get-class-periods'
};

type ClassPeriodsFilters = {
  school_id?: string;
};

export const listClassPeriods = (
  session?: Session | null,
  filters: ClassPeriodsFilters = {}
): Promise<FormattedClassPeriod[]> => {
  const api = initializeApi(session);

  return api
    .get<ClassPeriod[]>('/education/admin/class-periods', { params: filters })
    .then((response) => response.data.map(classPeriodsMapper));
};

export const fetchClassPeriods = (
  session?: Session | null,
  filters: ClassPeriodsFilters = {}
) => {
  return queryClient.fetchQuery(queryKeys.LIST_CLASS_PERIODS, () =>
    listClassPeriods(session, filters)
  );
};

export const useListClassPeriods = (
  session?: Session | null,
  filters: ClassPeriodsFilters = {}
) => {
  return useQuery(queryKeys.LIST_CLASS_PERIODS, () =>
    listClassPeriods(session, filters)
  );
};
