import { QueryOptions, useQuery } from 'react-query';

import { CompleteSchool, School, SchoolWithEnrollCount } from 'models/School';
import { EnrollCountResponse } from 'models/Enroll';
import { ClassroomsCountResponse } from 'models/Classroom';
import { Multigrade } from 'models/Multigrade';

import { createUnstableApi } from 'services/api';

type GetSchoolFilters = {
  id?: string;
};

type CountSchoolsResponse = {
  count: number;
};

export const schoolKeys = {
  all: 'schools' as const,
  lists: () => [...schoolKeys.all, 'list'] as const,
  list: (filters: string) => [...schoolKeys.lists(), { filters }] as const,
  shows: () => [...schoolKeys.all, 'shows'] as const,
  show: (filters: string) => [...schoolKeys.shows(), { filters }] as const,
  details: () => [...schoolKeys.all, 'details'] as const,
  detail: (filters: string) => [...schoolKeys.details(), { filters }] as const,
  counts: () => [...schoolKeys.all, 'counts'] as const,
  count: (filters: string) => [...schoolKeys.counts(), { filters }] as const
};

export const listSchools = (session?: AppSession) => {
  const api = createUnstableApi(session);

  return api
    .get<SchoolWithEnrollCount[]>('/schools')
    .then((response) => response.data);
};

export const getSchool = (
  filters: GetSchoolFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  const { id } = filters;

  return api
    .get<School>(`/schools/${id || 'me'}`)
    .then((response) => response.data);
};

export const getSchoolDetail = async (
  id: string,
  school_year_id?: string,
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  const school = await getSchool({ id }, session);

  const [enrollsCountResponse, classroomsCountResponse, multigradesResponse] =
    await Promise.all([
      api.get<EnrollCountResponse>(`/enrolls/count`, {
        params: { school_id: school.id, status: 'ACTIVE', school_year_id }
      }),
      api.get<ClassroomsCountResponse>(`/classrooms/count`, {
        params: { school_id: school.id, school_year_id }
      }),
      api.get<Multigrade[]>(`/multigrades`, {
        params: { school_id: school.id }
      })
    ]);

  const enroll_count = enrollsCountResponse.data.count;
  const classrooms_count = classroomsCountResponse.data.count;
  const multigrades_count = multigradesResponse.data.length;

  return {
    ...school,
    enroll_count,
    classrooms_count,
    multigrades_count
  };
};

export const countSchools = async (session?: AppSession) => {
  const api = createUnstableApi(session);

  return api
    .get<CountSchoolsResponse>('/schools/count')
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useListSchools = (
  queryOptions: QueryOptions<SchoolWithEnrollCount[]> = {}
) => {
  return useQuery<SchoolWithEnrollCount[]>(
    schoolKeys.list(JSON.stringify({})),
    () => listSchools(),
    queryOptions
  );
};

export const useGetSchool = (filters: GetSchoolFilters = {}) => {
  return useQuery<School>(schoolKeys.show(JSON.stringify(filters)), () =>
    getSchool(filters)
  );
};

export const useGetSchoolDetail = (id: string, school_year_id?: string) => {
  return useQuery<CompleteSchool>(
    schoolKeys.detail(JSON.stringify({ id, school_year_id })),
    () => getSchoolDetail(id, school_year_id)
  );
};

export const useCountSchools = () => {
  return useQuery(schoolKeys.count(JSON.stringify({})), () => countSchools());
};
