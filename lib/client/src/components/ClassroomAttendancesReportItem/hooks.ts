import { useMemo } from 'react';
import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { SchoolSubject } from 'models/SchoolSubject';

import { listClassroomTeacherSchoolSubjects } from 'requests/queries/classroom-teacher-school-subjects';
import { listSchoolSubjects } from 'requests/queries/school-subjects';

type ListClassSchoolSubjectsFilters = {
  classroom_id?: string;
  school_id?: string;
  employee_id?: string;
  grade_id?: string;
  school_year_id?: string;
  is_multidisciplinary?: boolean;
};

const findByTeacherSchoolSubjects = async (
  session: Session | null,
  filters: ListClassSchoolSubjectsFilters
) => {
  let is_multidisciplinary: 0 | 1 | null | undefined = undefined;
  if (typeof filters.is_multidisciplinary !== 'undefined') {
    if (filters.is_multidisciplinary === null) {
      is_multidisciplinary = null;
    } else {
      is_multidisciplinary = filters.is_multidisciplinary ? 1 : 0;
    }
  }

  const classroomTeacherSchoolSubjects =
    await listClassroomTeacherSchoolSubjects(session, {
      classroom_id: filters.classroom_id,
      employee_id: filters.employee_id,
      school_id: filters.school_id,
      is_multidisciplinary
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
  session: Session | null,
  filters: ListClassSchoolSubjectsFilters
) => {
  const isTeacher = session?.accessLevel?.code === 'teacher';

  if (!isTeacher || !filters.employee_id) {
    return listSchoolSubjects(session, {
      grade_id: filters.grade_id,
      school_year_id: filters.school_year_id,
      is_multidisciplinary: filters.is_multidisciplinary
    });
  }

  return findByTeacherSchoolSubjects(session, {
    classroom_id: filters.classroom_id,
    employee_id: session.user.employeeId,
    school_id: filters.school_id,
    grade_id: filters.grade_id,
    school_year_id: filters.school_year_id,
    is_multidisciplinary: filters.is_multidisciplinary
  });
};

export const useListSchoolSubjects = (
  session: Session | null,
  filters: ListClassSchoolSubjectsFilters
) => {
  const key = useMemo(() => {
    const filtersStr = JSON.stringify({
      lvl: session?.accessLevel?.code,
      userEmployee: session?.user.employeeId,
      ...filters
    });

    return `list-class-school-subjects-${filtersStr}`;
  }, [session, filters]);

  const result = useQuery(key, () =>
    listSchoolSubjectsToClass(session, filters)
  );

  return { ...result, key };
};
