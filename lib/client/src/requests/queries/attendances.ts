import { Session } from 'next-auth';
import { QueryObserverOptions, useQuery } from 'react-query';

import {
  Attendance,
  AttendanceCount,
  ListAttendancesByClassResponseDTO
} from 'models/Attendance';
import { SchoolTerm } from 'models/SchoolTerm';

import { initializeApi } from 'services/api';

type ListAttendancesFilters = {
  class_id?: string | string[];
  classroom_id?: string;
  enroll_id?: string;
  attendance?: boolean | number;
};

export const listAttendances = (
  session: Session | null,
  params: ListAttendancesFilters = {}
) => {
  const api = initializeApi(session);

  const { attendance } = params;
  if (typeof attendance !== 'undefined' && attendance !== null) {
    params.attendance = Number(attendance);
  }

  return api
    .get<Attendance[]>(`/attendances`, { params })
    .then((response) => response.data);
};

export type ListAttendancesByClassesFilters = {
  classroom_id?: string;
  school_subject_id?: string;
  employee_id?: string;
  school_id?: string;
  class_date?: string;
  class_period_id?: string;
  grade_id?: string;
  status?: string;
  school_term?: SchoolTerm;
  limit?: number;
  sortBy?: string;
  order?: 'DESC' | 'ASC';
  before?: string;
  enroll_id?: string;
};

export const listAttendancesByClasses = (
  session: Session | null,
  params: ListAttendancesByClassesFilters = {}
) => {
  const api = initializeApi(session);

  return api
    .get<ListAttendancesByClassResponseDTO>(`/attendances/by-classes`, {
      params
    })
    .then((response) => response.data);
};

export const useListAttendances = (
  session: Session | null,
  filters: ListAttendancesFilters = {},
  queryOptions?: QueryObserverOptions<Attendance[]>
) => {
  const key = `list-attendances-${JSON.stringify(filters)}`;
  const result = useQuery<Attendance[]>(
    key,
    () => listAttendances(session, filters),
    queryOptions
  );

  return { ...result, key };
};

export const useListAttendancesByClasses = (
  session: Session | null,
  filters: ListAttendancesByClassesFilters = {},
  queryOptions?: QueryObserverOptions<ListAttendancesByClassResponseDTO>
) => {
  const key = `list-attendances-by-classes-${JSON.stringify(filters)}`;
  const result = useQuery<ListAttendancesByClassResponseDTO>(
    key,
    () => listAttendancesByClasses(session, filters),
    queryOptions
  );

  return { ...result, key };
};

type CountAttendancesFilters = {
  class_id?: string | string[] | 'all';
  classroom_id?: string | string[];
  enroll_id?: string;
  school_subject_id?: string | string[];
  attendance?: boolean | number;
  split_by_school_subject?: boolean | number;
  split_by_school_term?: boolean | number;
};

export const countAttendances = (
  session: Session | null,
  filters: CountAttendancesFilters = {}
) => {
  const api = initializeApi(session);

  const {
    attendance,
    split_by_school_subject,
    split_by_school_term,
    ...params
  } = filters;
  const newParams = { ...params } as CountAttendancesFilters;

  if (typeof attendance !== 'undefined') {
    newParams.attendance = Number(attendance);
  }
  if (typeof split_by_school_subject !== 'undefined') {
    newParams.split_by_school_subject = Number(split_by_school_subject);
  }
  if (typeof split_by_school_term !== 'undefined') {
    newParams.split_by_school_term = Number(split_by_school_term);
  }

  return api
    .get<AttendanceCount[]>(`/attendances/count`, { params: newParams })
    .then((response) => response.data);
};

export const useCountAttendances = (
  session: Session | null,
  filters: CountAttendancesFilters = {}
) => {
  const key = `count-attendances-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => countAttendances(session, filters));

  return { ...result, key };
};
