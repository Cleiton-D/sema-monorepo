import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { SchoolTermPeriod, TermPeriodStatus } from 'models/SchoolTermPeriod';

import { initializeApi } from 'services/api';

import { schoolTermPeriodMapper } from 'utils/mappers/schoolTermPeriodMapper';

type ListSchoolTermPeriodsFilters = {
  school_year_id?: string;
};

export const listSchoolTermPeriods = (
  session?: Session | null,
  filters: ListSchoolTermPeriodsFilters = {}
) => {
  const api = initializeApi(session);

  return api
    .get<SchoolTermPeriod[]>('/education/admin/school-term-periods', {
      params: filters
    })
    .then((response) => response.data);
};

export const useListSchoolTermPeriods = (
  session: Session | null,
  filters: ListSchoolTermPeriodsFilters = {}
) => {
  const key = `list-school-term-periods-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => listSchoolTermPeriods(session, filters));

  return { ...result, key };
};

type ShowSchoolTermPeriodFilters = {
  school_year_id?: string;
  status?: TermPeriodStatus;
};
export const showSchoolTermPeriod = (
  session?: Session | null,
  filters: ShowSchoolTermPeriodFilters = {}
) => {
  const api = initializeApi(session);

  return api
    .get<SchoolTermPeriod>('/education/admin/school-term-periods/show', {
      params: filters
    })
    .then((response) => schoolTermPeriodMapper(response.data));
};

export const useShowSchoolTermPeriod = (
  session: Session | null,
  filters: ShowSchoolTermPeriodFilters = {}
) => {
  const key = `show-school-term-period-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => showSchoolTermPeriod(session, filters));

  return { ...result, key };
};
