import { useQuery } from 'react-query';

import { Employee } from 'models/Employee';

import { createUnstableApi } from 'services/api';

type CountEmployeesResponse = {
  count: number;
};

type ListEmployeesFilters = {
  accessCode?: string;
  branch_id?: string;
};

export const listEmployees = (
  filters: ListEmployeesFilters = {},
  session?: AppSession
) => {
  const api = createUnstableApi(session);

  return api
    .get<Employee[]>('/employees', { params: filters })
    .then((response) => response.data);
};

export const employeesCount = (session?: AppSession) => {
  const api = createUnstableApi(session);

  return api
    .get<CountEmployeesResponse>('/employees/count')
    .then((response) => response.data)
    .catch(() => undefined);
};

export const useListEmployees = (filters: ListEmployeesFilters = {}) => {
  const key = `list-employees-${JSON.stringify(filters)}`;

  const result = useQuery(key, () => listEmployees(filters));
  return { ...result, key };
};

export const useEmployeesCount = () => {
  const key = `count-employees`;
  const result = useQuery(key, () => employeesCount());

  return { ...result, key };
};

type ShowEmployeeFilters = {
  accessCode?: string;
  branch_id?: string;
  employee_id?: string;
};

export const showEmployee = (
  filters: ShowEmployeeFilters,
  session?: AppSession
) => {
  const { employee_id, ...params } = filters;
  if (!employee_id && Object.keys(params).length === 0) return undefined;

  const api = createUnstableApi(session);
  return api
    .get<Employee>(`/employees/${employee_id || 'show'}`, { params })
    .then((response) => response.data)
    .catch(() => null);
};

export const useShowEmployee = (filters: ShowEmployeeFilters) => {
  const key = `show-employee-${JSON.stringify(filters)}`;
  const result = useQuery(key, () => showEmployee(filters));

  return { ...result, key };
};
