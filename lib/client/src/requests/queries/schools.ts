import { Session } from 'next-auth';
import { QueryOptions, useQuery } from 'react-query';

import { CompleteSchool, School, SchoolWithEnrollCount } from 'models/School';
import { EnrollCountResponse } from 'models/Enroll';

import { initializeApi } from 'services/api';
import { ClassroomsCountResponse } from 'models/Classroom';

type GetSchoolFilters = {
  id?: string;
};

type CountSchoolsResponse = {
  count: number;
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

export const getSchoolDetail = async (id: string, session?: Session | null) => {
  const api = initializeApi(session);

  const school = await getSchool(session, { id });

  const [enrollsCountResponse, classroomsCountResponse] = await Promise.all([
    api.get<EnrollCountResponse>(`/enrolls/count`, {
      params: { school_id: school.id, status: 'ACTIVE' }
    }),
    api.get<ClassroomsCountResponse>(`/schools/${school.id}/classrooms/count`)
  ]);

  const enroll_count = enrollsCountResponse.data.count;
  const classrooms_count = classroomsCountResponse.data.count;

  return {
    ...school,
    enroll_count,
    classrooms_count
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
    'get-schools',
    () => listSchools(session),
    queryOptions
  );
};

export const useGetSchool = (
  session?: Session | null,
  filters: GetSchoolFilters = {}
) => {
  return useQuery<School>(`get-school${JSON.stringify(filters)}`, () =>
    getSchool(session, filters)
  );
};

export const useGetSchoolDetail = (id: string, session?: Session | null) => {
  return useQuery<CompleteSchool>(`school_detail-${id}`, () =>
    getSchoolDetail(id, session)
  );
};

export const useCountSchools = (session?: Session | null) => {
  const key = 'count-schools';

  return useQuery(key, () => countSchools(session));
};
