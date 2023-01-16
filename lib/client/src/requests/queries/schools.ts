import { Session } from 'next-auth';
import { QueryOptions, useQuery } from 'react-query';

import { CompleteSchool, School, SchoolWithEnrollCount } from 'models/School';
import { EnrollCountResponse } from 'models/Enroll';
import { ClassroomsCountResponse } from 'models/Classroom';
import { Multigrade } from 'models/Multigrade';

import { initializeApi } from 'services/api';

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

export const listSchools = (session?: Session | null) => {
  const api = initializeApi(session);

  return api
    .get<SchoolWithEnrollCount[]>('/schools')
    .then((response) => response.data);
};

export const getSchool = (
  session?: Session | null,
  filters: GetSchoolFilters = {}
) => {
  const api = initializeApi(session);

  const { id } = filters;

  return api
    .get<School>(`/schools/${id || 'me'}`)
    .then((response) => response.data);
};

export const getSchoolDetail = async (
  id: string,
  session?: Session | null,
  school_year_id?: string
) => {
  const api = initializeApi(session);

  const school = await getSchool(session, { id });

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

export const countSchools = async (session?: Session | null) => {
  const api = initializeApi(session);

  return api
    .get<CountSchoolsResponse>('/schools/count')
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useListSchools = (
  session?: Session | null,
  queryOptions: QueryOptions<SchoolWithEnrollCount[]> = {}
) => {
  return useQuery<SchoolWithEnrollCount[]>(
    schoolKeys.list(JSON.stringify({})),
    () => listSchools(session),
    queryOptions
  );
};

export const useGetSchool = (
  session?: Session | null,
  filters: GetSchoolFilters = {}
) => {
  return useQuery<School>(schoolKeys.show(JSON.stringify(filters)), () =>
    getSchool(session, filters)
  );
};

export const useGetSchoolDetail = (
  id: string,
  session?: Session | null,
  school_year_id?: string
) => {
  return useQuery<CompleteSchool>(
    schoolKeys.detail(JSON.stringify({ id, school_year_id })),
    () => getSchoolDetail(id, session, school_year_id)
  );
};

export const useCountSchools = (session?: Session | null) => {
  return useQuery(schoolKeys.count(JSON.stringify({})), () =>
    countSchools(session)
  );
};
