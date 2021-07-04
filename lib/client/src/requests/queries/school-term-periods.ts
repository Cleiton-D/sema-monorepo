import { SchoolTermPeriod } from 'models/SchoolTermPeriod';
import { Session } from 'next-auth';
import { useQuery } from 'react-query';
import { initializeApi } from 'services/api';

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
