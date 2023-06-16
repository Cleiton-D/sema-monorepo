import { useQuery, UseQueryOptions } from 'react-query';

import { SchoolReport } from 'models/SchoolReport';

import { createUnstableApi } from 'services/api';

type ListSchoolReportsFilters = {
  enroll_id?: string;
  classroom_id?: string;
  school_subject_id?: string;
  school_year_id?: string;
  student_id?: string;
  grade_id?: string;
  enroll_as?: 'all' | 'last' | 'first';
};

export const listSchoolReports = async (
  filters: ListSchoolReportsFilters,
  session?: AppSession
) => {
  const validFilter = Object.values(filters).some(
    (value) => value !== undefined
  );

  if (!validFilter) return [];

  const api = createUnstableApi(session);

  const response = await api
    .get<SchoolReport[]>('/enrolls/reports', { params: filters })
    .then((response) => response.data);

  return response;
};

export const useListSchoolReports = (
  filters: ListSchoolReportsFilters,
  queryOptions: UseQueryOptions<SchoolReport[]> = {}
) => {
  const key = `list-school-reports-${JSON.stringify(filters)}`;

  const result = useQuery<SchoolReport[]>(
    key,
    () => listSchoolReports(filters),
    queryOptions
  );

  return { ...result, key };
};
