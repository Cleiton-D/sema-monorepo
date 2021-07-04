import { useCallback } from 'react';
import { useSession } from 'next-auth/client';

import ToastContent from 'components/ToastContent';

import { Employee } from 'models/Employee';

import { initializeApi, useMutation } from 'services/api';

export function useCreateEmployee() {
  const [session] = useSession();

  const createEmployee = useCallback(
    async (values) => {
      const api = initializeApi(session);

      const { data: responseData } = await api.post<Employee>(
        '/employees',
        values
      );

      return responseData;
    },
    [session]
  );

  return useMutation('create-employee', createEmployee, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando servidor...</ToastContent>;
    },
    renderError: () => `Falha ao salvar servidor.`,
    renderSuccess: () => `Servidor cadastrado com sucesso.`
  });
}
