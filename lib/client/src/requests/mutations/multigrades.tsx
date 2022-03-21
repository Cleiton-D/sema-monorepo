import { useCallback } from 'react';
import { useSession } from 'next-auth/react';

import ToastContent from 'components/ToastContent';

import { initializeApi, useMutation } from 'services/api';
import { Multigrade } from 'models/Multigrade';

type CreateMultigradePayload = {
  description: string;
  class_period_id: string;
  school_id: string;
  is_multigrade?: boolean;
};

export function useAddMultigrade() {
  const { data: session } = useSession();

  const addMultigrade = useCallback(
    async (values: CreateMultigradePayload) => {
      const api = initializeApi(session);
      const { ...data } = values;

      const requestData = {
        ...data,
        school_year_id: session?.configs.school_year_id
      };
      const { data: responseData } = await api.post(`/classrooms`, requestData);

      return responseData;
    },
    [session]
  );

  return useMutation('add-multigrade', addMultigrade, {
    renderLoading: function render(newMultigrade) {
      return (
        <ToastContent showSpinner>
          Salvando {newMultigrade.description}...
        </ToastContent>
      );
    },
    renderError: (newMultigrade) =>
      `Falha ao salvar ${newMultigrade.description}`,
    renderSuccess: (newMultigrade) =>
      `${newMultigrade.description} salvo com sucesso.`
  });
}

export function useDeleteMultigrade() {
  const { data: session } = useSession();

  const deleteMultigrade = useCallback(
    async (multigrade: Multigrade) => {
      const api = initializeApi(session);
      const { id } = multigrade;

      await api.delete(`/classrooms/${id}`);
    },
    [session]
  );

  return useMutation('delete-multigrade', deleteMultigrade, {
    renderLoading: function render(multigrade) {
      return (
        <ToastContent showSpinner>
          Apagando {multigrade.description}...
        </ToastContent>
      );
    },
    renderError: (multigrade) => `Falha ao apagar ${multigrade.description}`,
    renderSuccess: (multigrade) =>
      `${multigrade.description} apagado com sucesso.`
  });
}
