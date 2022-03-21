import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { initializeApi, queryClient } from 'services/api';
import { ClassPeriod, FormattedClassPeriod } from 'models/ClassPeriod';
import { classPeriodsMapper } from 'utils/mappers/classPeriodMapper';

export const queryKeys = {
  LIST_CLASS_PERIODS: 'get-class-periods'
};

export const listClassPeriods = (
  session?: Session | null
): Promise<FormattedClassPeriod[]> => {
  const api = initializeApi(session);

  return api
    .get<ClassPeriod[]>('/education/admin/class-periods')
    .then((response) => response.data.map(classPeriodsMapper));
};

export const fetchClassPeriods = (session?: Session | null) => {
  return queryClient.fetchQuery(queryKeys.LIST_CLASS_PERIODS, () =>
    listClassPeriods(session)
  );
};

export const useListClassPeriods = (session?: Session | null) => {
  return useQuery(queryKeys.LIST_CLASS_PERIODS, () =>
    listClassPeriods(session)
  );
};
