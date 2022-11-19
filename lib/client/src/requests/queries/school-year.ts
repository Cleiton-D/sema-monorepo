import { SchoolYear } from 'models/SchoolYear';
import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { initializeApi } from 'services/api';

import {
  mapSchoolTermPeriodsToObject,
  orderSchoolTerm,
  schoolTermPeriodMapper
} from 'utils/mappers/schoolTermPeriodMapper';
import { schoolYearMapper } from 'utils/mappers/schoolYearMapper';

import { listSchoolTermPeriods } from './school-term-periods';

type GetSchoolYearFilters = {
  id?: string | 'current';
};

export const getSchoolYearWithSchoolTerms = async (
  session?: Session | null,
  filters: GetSchoolYearFilters = {}
) => {
  const api = initializeApi(session);

  const { id, ...params } = filters;

  const schoolYear = await api
    .get<SchoolYear>(`/education/admin/school-years/${id || 'current'}`, {
      params
    })
    .then((response) => response.data)
    .catch(() => undefined);

  const schoolTermPeriodsResponse = schoolYear
    ? await listSchoolTermPeriods(session, {
        school_year_id: schoolYear.id
      }).catch(() => [])
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
  session?: Session | null,
  filters: GetSchoolYearFilters = {}
) => {
  return useQuery(['show-school-year-detail'], () =>
    getSchoolYearWithSchoolTerms(session, filters)
  );
};

export const showSchoolYear = async (
  session?: Session | null,
  filters: GetSchoolYearFilters = {}
) => {
  const api = initializeApi(session);

  const { id, ...params } = filters;

  return api
    .get<SchoolYear>(`/education/admin/school-years/${id || 'current'}`, {
      params
    })
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useShowSchoolYear = (
  session?: Session | null,
  filters: GetSchoolYearFilters = {}
) => {
  return useQuery(['show-school-year', JSON.stringify(filters)], () =>
    showSchoolYear(session, filters)
  );
};
