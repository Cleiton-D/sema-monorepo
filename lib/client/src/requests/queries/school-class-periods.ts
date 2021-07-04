import { SchoolClassPeriod } from 'models/SchoolClassPeriod';
import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { initializeApi } from 'services/api';

type SchoolClassperiodsFilters = {
  school_id?: string;
  school_year_id?: string;
};

export const listSchoolClassPeriods = (
  session?: Session | null,
  filters: SchoolClassperiodsFilters = {}
) => {
  const api = initializeApi(session);

  const { school_id, ...params } = filters;

  return api
    .get<SchoolClassPeriod[]>(`/schools/${school_id || 'all'}/class-periods`, {
      params
    })
    .then((response) => response.data);
};

export const useListSchoolClassPeriods = (
  session?: Session | null,
  filters: SchoolClassperiodsFilters = {}
) => {
  const { school_id } = filters;

  return useQuery(`get-school-class-periods-${school_id || 'all'}`, () =>
    listSchoolClassPeriods(session, filters)
  );
};
