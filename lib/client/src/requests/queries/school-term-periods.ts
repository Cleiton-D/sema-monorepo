import { useQuery } from 'react-query';

import { SchoolTermPeriod, TermPeriodStatus } from 'models/SchoolTermPeriod';

import { createUnstableApi } from 'services/api';

import { schoolTermPeriodMapper } from 'utils/mappers/schoolTermPeriodMapper';

type ListSchoolTermPeriodsFilters = {
  school_year_id?: string;
  status?: TermPeriodStatus | TermPeriodStatus[];
};

export const listSchoolTermPeriods = (
  filters: ListSchoolTermPeriodsFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<SchoolTermPeriod[]>('/education/admin/school-term-periods', {
      params: filters
    })
    .then((response) => response.data);
};

export const useListSchoolTermPeriods = (
  filters: ListSchoolTermPeriodsFilters = {}
) => {
  const key = `list-school-term-periods-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => listSchoolTermPeriods(filters));

  return { ...result, key };
};

type ShowSchoolTermPeriodFilters = {
  id?: string;
  school_year_id?: string;
  contain_date?: string | Date;
  status?: TermPeriodStatus;
};
export const showSchoolTermPeriod = (
  filters: ShowSchoolTermPeriodFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<SchoolTermPeriod>('/education/admin/school-term-periods/show', {
      params: filters
    })
    .then((response) => schoolTermPeriodMapper(response.data));
};

export const useShowSchoolTermPeriod = (
  filters: ShowSchoolTermPeriodFilters = {}
) => {
  const key = `show-school-term-period-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => showSchoolTermPeriod(filters));

  return { ...result, key };
};
