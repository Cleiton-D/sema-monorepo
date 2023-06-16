import { useCallback } from 'react';

import ToastContent from 'components/ToastContent';

import { AddressFormData } from 'models/Address';
import { ContactFormData } from 'models/Contact';
import { Employee } from 'models/Employee';

import { createUnstableApi, useMutation } from 'services/api';

type SafeEmployeeRequestData = {
  id?: string;
  birth_date: string;
  pis_pasep: string;
  cpf: string;
  rg?: string;
  name: string;
  gender?: 'male' | 'female';
  mother_name: string;
  dad_name?: string;
  address: AddressFormData;
  education_level: string;
  contacts: ContactFormData[];
};

export function useSaveEmployee() {
  const saveEmployee = useCallback(async (values: SafeEmployeeRequestData) => {
    const api = createUnstableApi();
    const { id, ...data } = values;

    const { data: responseData } = id
      ? await api.put<Employee>(`/employees/${id}`, data)
      : await api.post<Employee>('/employees', values);

    return responseData;
  }, []);

  return useMutation('save-employee', saveEmployee, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando servidor...</ToastContent>;
    },
    renderError: () => `Falha ao salvar servidor.`,
    renderSuccess: () => `Servidor salvo com sucesso.`
  });
}

export function useDeleteEmployee() {
  const deleteEmployee = useCallback(async (employee: Employee) => {
    const api = createUnstableApi();

    return api.delete(`/employees/${employee.id}`);
  }, []);

  return useMutation('delete-employee', deleteEmployee, {
    renderLoading: function render(deletedEmployee) {
      return (
        <ToastContent showSpinner>
          Removendo {deletedEmployee.name}...
        </ToastContent>
      );
    },
    renderError: (deletedEmployee) =>
      `Falha ao remover ${deletedEmployee.name}`,
    renderSuccess: (deletedEmployee) =>
      `${deletedEmployee.name} removido com sucesso`
  });
}
