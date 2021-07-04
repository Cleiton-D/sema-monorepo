import { SchoolReport } from 'models/SchoolReport';
import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { initializeApi } from 'services/api';

type ListSchoolReportsFilters = {
  enroll_id?: string;
  classroom_id?: string;
  school_subject_id?: string;
};

export const listSchoolReports = async (
  session: Session | null,
  filters: ListSchoolReportsFilters
) => {
  const validFilter = Object.values(filters).some(
    (value) => value !== undefined
  );

  if (!validFilter) return [];

  const api = initializeApi(session);

  const response = await api
    .get<SchoolReport[]>('/enrolls/reports', { params: filters })
    .then((response) => response.data);

  return response;
};

export const useListSchoolReports = (
  session: Session | null,
  filters: ListSchoolReportsFilters
) => {
  const key = `list-school-reports-${JSON.stringify(filters)}`;

  const result = useQuery(key, () => listSchoolReports(session, filters));

  return { ...result, key };
};
