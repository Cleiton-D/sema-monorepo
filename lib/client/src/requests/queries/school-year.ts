import { useQuery } from 'react-query';

import { createUnstableApi } from 'services/api';

import {
  mapSchoolTermPeriodsToObject,
  orderSchoolTerm,
  schoolTermPeriodMapper
} from 'utils/mappers/schoolTermPeriodMapper';
import { schoolYearMapper } from 'utils/mappers/schoolYearMapper';

import { listSchoolTermPeriods } from './school-term-periods';
import { SchoolYear } from 'models/SchoolYear';
import { Status } from 'models/Status';

type GetSchoolYearFilters = {
  id?: string | 'current';
};

export const getSchoolYearWithSchoolTerms = async (
  filters: GetSchoolYearFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  const { id, ...params } = filters;

  const schoolYear = await api
    .get<SchoolYear>(`/education/admin/school-years/${id || 'current'}`, {
      params
    })
    .then((response) => response.data)
    .catch(() => undefined);

  const schoolTermPeriodsResponse = schoolYear
    ? await listSchoolTermPeriods(
        {
          school_year_id: schoolYear.id
        },
        session
      ).catch(() => [])
    : [];

  const schoolTermPeriodsArray = schoolTermPeriodsResponse
    .sort((a, b) => orderSchoolTerm(a.school_term, b.school_term))
    .map(schoolTermPeriodMapper);

  return {
    ...(schoolYear ? schoolYearMapper(schoolYear) : {}),
    schoolTermPeriodsArray: schoolTermPeriodsArray,
    schoolTermPeriods: mapSchoolTermPeriodsToObject(schoolTermPeriodsResponse)
  };
};

export const useSchoolYearWithSchoolTerms = (
  filters: GetSchoolYearFilters = {}
) => {
  return useQuery(['show-school-year', 'detail', JSON.stringify(filters)], () =>
    getSchoolYearWithSchoolTerms(filters)
  );
};

export const showSchoolYear = async (
  filters: GetSchoolYearFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  const { id, ...params } = filters;

  return api
    .get<SchoolYear>(`/education/admin/school-years/${id || 'current'}`, {
      params
    })
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useShowSchoolYear = (filters: GetSchoolYearFilters = {}) => {
  return useQuery(['show-school-year', JSON.stringify(filters)], () =>
    showSchoolYear(filters)
  );
};

type ListSchoolYearsFilters = {
  status?: Status | Status[];
};
export const listSchoolYears = async (
  params: ListSchoolYearsFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<SchoolYear[]>(`/education/admin/school-years`, {
      params
    })
    .then((response) => response.data)
    .catch(() => []);
};

export const useListSchoolYears = (filters: ListSchoolYearsFilters = {}) => {
  return useQuery(['list-school-years', JSON.stringify(filters)], () =>
    listSchoolYears(filters)
  );
};
