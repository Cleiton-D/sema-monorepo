import { Session } from 'next-auth';
import { QueryObserverOptions, useQuery } from 'react-query';

import { ClassroomTeacherSchoolSubject } from 'models/ClassroomTeacherSchoolSubject';

import { initializeApi } from 'services/api';

type ListClassroomTeacherSchoolSubjectsFilters = {
  classroom_id?: string;
  school_id?: string;
  employee_id?: string;
  school_subject_id?: string;
  is_multidisciplinary?: 0 | 1 | null;
};

export const classroomTeacherSchoolSubjectsKeys = {
  all: ['classroom-teacher-school-subjects'] as const,
  lists: () => [...classroomTeacherSchoolSubjectsKeys.all, 'list'] as const,
  list: (filters: string) =>
    [...classroomTeacherSchoolSubjectsKeys.lists(), { filters }] as const
};

export const listClassroomTeacherSchoolSubjects = (
  session: Session | null,
  filters: ListClassroomTeacherSchoolSubjectsFilters
) => {
  const api = initializeApi(session);

  return api
    .get<ClassroomTeacherSchoolSubject[]>(
      `/classroom-teacher-school-subjects`,
      { params: filters }
    )
    .then((response) => response.data);
};

export const useListClassroomTeacherSchoolSubjects = (
  session: Session | null,
  {
    is_multidisciplinary = 0,
    ...rest
  }: ListClassroomTeacherSchoolSubjectsFilters,
  queryOptions: QueryObserverOptions<ClassroomTeacherSchoolSubject[]> = {}
) => {
  const filters = { is_multidisciplinary, ...rest };
  const key = classroomTeacherSchoolSubjectsKeys.list(JSON.stringify(filters));

  const result = useQuery<ClassroomTeacherSchoolSubject[]>(
    key,
    () => listClassroomTeacherSchoolSubjects(session, filters),
    queryOptions
  );

  return { ...result, key };
};

type ShowClassroomTeacherSchoolSubjectsFilters = {
  id: string;
};

export const showClassroomTeacherSchoolSubject = (
  session: Session | null,
  { id }: ShowClassroomTeacherSchoolSubjectsFilters
) => {
  const api = initializeApi(session);

  return api
    .get<ClassroomTeacherSchoolSubject>(
      `/classroom-teacher-school-subjects/${id}`
    )
    .then((response) => response.data);
};
