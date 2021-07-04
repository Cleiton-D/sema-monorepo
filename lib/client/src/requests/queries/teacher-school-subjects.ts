import { TeacherSchoolSubject } from 'models/TeacherSchoolSubject';
import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { initializeApi } from 'services/api';

type ListTeacherSchoolSubjectsFilters = {
  school_id?: string;
  school_subject_id?: string | string[];
};

export const listTeacherSchoolSubjects = (
  session: Session | null,
  filters: ListTeacherSchoolSubjectsFilters = {}
) => {
  const { school_id, ...params } = filters;
  if (!school_id) return [];

  const api = initializeApi(session);
  return api
    .get<TeacherSchoolSubject[]>(
      `/schools/${school_id}/teacher-school-subjects`,
      { params }
    )
    .then((response) => response.data);
};

export const useListTeacherSchoolSubjects = (
  session: Session | null,
  filters: ListTeacherSchoolSubjectsFilters = {}
) => {
  const key = `list-teacher-school-subjects-${JSON.stringify(filters)}`;

  const result = useQuery(key, () =>
    listTeacherSchoolSubjects(session, filters)
  );

  return { ...result, key };
};
