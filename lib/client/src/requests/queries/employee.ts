import { Session } from 'next-auth';
import { useQuery } from 'react-query';

import { Employee } from 'models/Employee';

import { initializeApi } from 'services/api';

type CountEmployeesResponse = {
  count: number;
};

type ListEmployeesFilters = {
  accessCode?: string;
  branch_id?: string;
};

export const listEmployees = (
  session: Session | null,
  filters: ListEmployeesFilters = {}
) => {
  const api = initializeApi(session);

  return api
    .get<Employee[]>('/employees', { params: filters })
    .then((response) => response.data);
};

export const employeesCount = (session: Session | null) => {
  const api = initializeApi(session);

  return api
    .get<CountEmployeesResponse>('/employees/count')
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useListEmployees = (
  session: Session | null,
  filters: ListEmployeesFilters = {}
) => {
  const key = `list-employees-${JSON.stringify(filters)}`;

  const result = useQuery(key, () => listEmployees(session, filters));
  return { ...result, key };
};

export const useEmployeesCount = (session: Session | null) => {
  const key = `count-employees`;
  const result = useQuery(key, () => employeesCount(session));

  return { ...result, key };
};

type ShowEmployeeFilters = {
  accessCode?: string;
  branch_id?: string;
  employee_id?: string;
};

export const showEmployee = (
  session: Session | null,
  filters: ShowEmployeeFilters
) => {
  const { employee_id, ...params } = filters;
  if (!employee_id && Object.keys(params).length === 0) return undefined;

  const api = initializeApi(session);
  return api
    .get<Employee>(`/employees/${employee_id || 'show'}`, { params })
    .then((response) => response.data)
    .catch(() => null);
};

export const useShowEmployee = (
  session: Session | null,
  filters: ShowEmployeeFilters
) => {
  const key = `show-employee-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => showEmployee(session, filters));

  return { ...result, key };
};
