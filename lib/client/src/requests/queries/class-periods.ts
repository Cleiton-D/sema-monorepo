import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { createUnstableApi } from 'services/api';
import { ClassPeriod, FormattedClassPeriod } from 'models/ClassPeriod';
import { classPeriodsMapper } from 'utils/mappers/classPeriodMapper';

export const classPeriodsKeys = {
  all: 'class_periods' as const,
  lists: () => [...classPeriodsKeys.all, 'list'] as const,
  list: (filters: string) => [...classPeriodsKeys.lists(), { filters }] as const
};

type ClassPeriodsFilters = {
  school_id?: string;
  school_year_id?: string;
};

export const listClassPeriods = (
  filters: ClassPeriodsFilters = {},
  session?: AppSession
): Promise<FormattedClassPeriod[]> => {
  const api = createUnstableApi(session);

  return api
    .get<ClassPeriod[]>('/education/admin/class-periods', { params: filters })
    .then((response) => response.data.map(classPeriodsMapper));
};

export const useListClassPeriods = (filters: ClassPeriodsFilters = {}) => {
  const key = useMemo(
    () => classPeriodsKeys.list(JSON.stringify(filters)),
    [filters]
  );

  return useQuery(key, () => listClassPeriods(filters));
};
