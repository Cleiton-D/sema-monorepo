import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { SchoolSubject } from 'models/SchoolSubject';

import { listClassroomTeacherSchoolSubjects } from 'requests/queries/classroom-teacher-school-subjects';
import { listGradeSchoolSubjects } from 'requests/queries/grade-school-subjects';

type ListClassSchoolSubjectsFilters = {
  isTeacher: boolean;
  userEmployeeId?: string;
  accessLevel?: string;
  classroom_id?: string;
  school_id?: string;
  employee_id?: string;
  grade_id?: string;
  school_year_id?: string;
  is_multidisciplinary?: boolean;
  include_multidisciplinary?: boolean;
};

const findByTeacherSchoolSubjects = async (
  filters: ListClassSchoolSubjectsFilters
) => {
  const classroomTeacherSchoolSubjects =
    await listClassroomTeacherSchoolSubjects({
      classroom_id: filters.classroom_id,
      employee_id: filters.employee_id,
      school_id: filters.school_id,
      is_multidisciplinary: null
    });

  const { grade_id, school_year_id } = filters;

  const schoolSubjectsObj = classroomTeacherSchoolSubjects
    .filter(({ school_subject }) => !!school_subject)
    .reduce<Record<string, SchoolSubject>>((acc, item) => {
      if (grade_id && grade_id !== item.classroom.grade_id) return acc;
      if (school_year_id && school_year_id !== item.classroom.school_year_id)
        return acc;

      return { ...acc, [item.school_subject_id]: item.school_subject };
    }, {});

  return Object.values(schoolSubjectsObj);
};

const listSchoolSubjectsToClass = async (
  filters: ListClassSchoolSubjectsFilters
) => {
  if (!filters.isTeacher || !filters.employee_id) {
    const gradeSchoolSubjects = await listGradeSchoolSubjects({
      grade_id: filters.grade_id,
      is_multidisciplinary: filters.is_multidisciplinary,
      include_multidisciplinary: filters.include_multidisciplinary
      // school_year_id: filters.school_year_id,
    });

    return gradeSchoolSubjects
      .filter(({ school_subject }) => !!school_subject)
      .map(({ school_subject }) => school_subject) as SchoolSubject[];
  }

  return findByTeacherSchoolSubjects({
    isTeacher: filters.isTeacher,
    classroom_id: filters.classroom_id,
    employee_id: filters.userEmployeeId,
    school_id: filters.school_id,
    grade_id: filters.grade_id,
    school_year_id: filters.school_year_id
  });
};

export const useListSchoolSubjects = (
  filters: ListClassSchoolSubjectsFilters
) => {
  const key = useMemo(() => {
    const filtersStr = JSON.stringify({
      lvl: filters.accessLevel,
      userEmployee: filters.userEmployeeId,
      ...filters
    });

    return `list-class-school-subjects-${filtersStr}`;
  }, [filters]);

  const result = useQuery(key, () => listSchoolSubjectsToClass(filters));

  return { ...result, key };
};
