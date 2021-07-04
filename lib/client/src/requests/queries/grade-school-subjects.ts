import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { GradeSchoolSubject } from 'models/GradeSchoolSubject';

import { initializeApi } from 'services/api';

type GradeSchoolSubjectsFilters = {
  grade_id?: string;
  school_year_id?: string;
};

export const listGradeSchoolSubjects = (
  session?: Session | null,
  filters: GradeSchoolSubjectsFilters = {}
) => {
  const api = initializeApi(session);

  const { grade_id, ...params } = filters;

  return grade_id
    ? api
        .get<GradeSchoolSubject[]>(
          `/education/admin/grades/${grade_id}/school-subjects`,
          { params }
        )
        .then((response) => response.data)
    : Promise.resolve([]);
};

export const useListGradeSchoolSubjects = (
  session?: Session | null,
  filters: GradeSchoolSubjectsFilters = {}
) => {
  const key = Object.entries(filters)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return useQuery(`list-grade-school-subjects${key}`, () =>
    listGradeSchoolSubjects(session, filters)
  );
};
