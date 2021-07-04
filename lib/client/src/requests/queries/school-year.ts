import { SchoolTermPeriod } from 'models/SchoolTermPeriod';
import { SchoolYear } from 'models/SchoolYear';
import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { initializeApi } from 'services/api';

import { mapSchoolTermPeriodsToObject } from 'utils/mappers/schoolTermPeriodMapper';
import { schoolYearMapper } from 'utils/mappers/schoolYearMapper';

import { listClassPeriods } from './class-periods';
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

  const schoolTermPeriodsRequest = schoolYear
    ? listSchoolTermPeriods(session, {
        school_year_id: schoolYear.id
      }).catch(() => [])
    : Promise.resolve([]);

  const listClassPeriodsRequest = schoolYear
    ? listClassPeriods(session, {
        school_year_id: schoolYear.id
      }).catch(() => [])
    : Promise.resolve([]);

  const [
    schoolTermPeriodsResponse,
    listClassPeriodsResponse
  ] = await Promise.all([schoolTermPeriodsRequest, listClassPeriodsRequest]);

  return {
    ...(schoolYear ? schoolYearMapper(schoolYear) : {}),
    classPeriods: listClassPeriodsResponse,
    schoolTermPeriods: mapSchoolTermPeriodsToObject(schoolTermPeriodsResponse)
  };
};

export const useSchoolYearWithSchoolTerms = (
  session?: Session | null,
  filters: GetSchoolYearFilters = {}
) => {
  return useQuery('show-school-year', () =>
    getSchoolYearWithSchoolTerms(session, filters)
  );
};
