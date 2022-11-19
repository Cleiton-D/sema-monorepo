import { useCallback } from 'react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

import ToastContent from 'components/ToastContent';

import { AddressFormData } from 'models/Address';
import { ContactFormData } from 'models/Contact';
import { Employee } from 'models/Employee';

import { initializeApi, useMutation } from 'services/api';

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
  const { data: session } = useSession();

  const saveEmployee = useCallback(
    async (values: SafeEmployeeRequestData) => {
      const api = initializeApi(session);
      const { id, ...data } = values;

      const { data: responseData } = id
        ? await api.put<Employee>(`/employees/${id}`, data)
        : await api.post<Employee>('/employees', values);

      return responseData;
    },
    [session]
  );

  return useMutation('save-employee', saveEmployee, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando servidor...</ToastContent>;
    },
    renderError: () => `Falha ao salvar servidor.`,
    renderSuccess: () => `Servidor salvo com sucesso.`
  });
}

export function useDeleteEmployee(session?: Session | null) {
  const deleteEmployee = useCallback(
    async (employee: Employee) => {
      const api = initializeApi(session);

      return api.delete(`/employees/${employee.id}`);
    },
    [session]
  );

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
