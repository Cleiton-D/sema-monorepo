import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { ClassroomTeacherSchoolSubject } from 'models/ClassroomTeacherSchoolSubject';

import { initializeApi } from 'services/api';

type ListClassroomTeacherSchoolSubjectsFilters = {
  classroom_id?: string;
  school_id?: string;
  employee_id?: string;
};

export const listClassroomTeacherSchoolSubjects = (
  session: Session | null,
  filters: ListClassroomTeacherSchoolSubjectsFilters
) => {
  const { classroom_id, school_id, ...params } = filters;
  if (!classroom_id || !school_id) return [];

  const api = initializeApi(session);

  return api
    .get<ClassroomTeacherSchoolSubject[]>(
      `/schools/${school_id}/classrooms/${classroom_id}/teacher-school-subjects`,
      { params }
    )
    .then((response) => response.data);
};

export const useListClassroomTeacherSchoolSubjects = (
  session: Session | null,
  filters: ListClassroomTeacherSchoolSubjectsFilters
) => {
  const key = `list-classroom-teacher-school-subjects${JSON.stringify(
    filters
  )}`;

  const result = useQuery(key, () =>
    listClassroomTeacherSchoolSubjects(session, filters)
  );

  return { ...result, key };
};
