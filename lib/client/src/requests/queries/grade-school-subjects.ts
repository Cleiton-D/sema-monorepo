import { QueryObserverOptions, useQuery } from 'react-query';

import { GradeSchoolSubject } from 'models/GradeSchoolSubject';

import { createUnstableApi } from 'services/api';

type GradeSchoolSubjectsFilters = {
  grade_id?: string;
  school_subject_id?: string;
  is_multidisciplinary?: boolean;
  include_multidisciplinary?: boolean;
};

export const listGradeSchoolSubjects = (
  filters: GradeSchoolSubjectsFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  const {
    grade_id,
    is_multidisciplinary,
    include_multidisciplinary,
    ...restParams
  } = filters;
  const params = { ...restParams } as any;

  if (typeof is_multidisciplinary !== 'undefined') {
    params.is_multidisciplinary = Number(is_multidisciplinary);
  }
  if (typeof include_multidisciplinary !== 'undefined') {
    params.include_multidisciplinary = Number(include_multidisciplinary);
  }

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
  filters: GradeSchoolSubjectsFilters = {},
  queryOptions: QueryObserverOptions<GradeSchoolSubject[]> = {}
) => {
  const key = Object.entries(filters)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return useQuery<GradeSchoolSubject[]>(
    `list-grade-school-subjects${key}`,
    () => listGradeSchoolSubjects(filters),
    queryOptions
  );
};
