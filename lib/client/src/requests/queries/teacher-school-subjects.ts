import { useQuery } from 'react-query';

import { TeacherSchoolSubject } from 'models/TeacherSchoolSubject';
import { createUnstableApi } from 'services/api';

type ListTeacherSchoolSubjectsFilters = {
  school_id?: string;
  school_subject_id?: string | string[];
};

export const listTeacherSchoolSubjects = (
  filters: ListTeacherSchoolSubjectsFilters = {},
  session?: AppSession
) => {
  const { school_id, ...params } = filters;
  if (!school_id) return [];

  const api = createUnstableApi(session);
  return api
    .get<TeacherSchoolSubject[]>(
      `/schools/${school_id}/teacher-school-subjects`,
      { params }
    )
    .then((response) => response.data);
};

export const useListTeacherSchoolSubjects = (
  filters: ListTeacherSchoolSubjectsFilters = {}
) => {
  const key = `list-teacher-school-subjects-${JSON.stringify(filters)}`;

  const result = useQuery(key, () => listTeacherSchoolSubjects(filters));

  return { ...result, key };
};
