import { useCallback } from 'react';

import ToastContent from 'components/ToastContent';

import { createUnstableApi, useMutation } from 'services/api';
import { Multigrade } from 'models/Multigrade';

type CreateMultigradePayload = {
  description: string;
  class_period_id: string;
  school_id: string;
  is_multigrade?: boolean;
  school_year_id?: string;
};

export function useAddMultigrade() {
  const addMultigrade = useCallback(async (values: CreateMultigradePayload) => {
    const api = createUnstableApi();
    const { ...data } = values;

    const requestData = {
      ...data
    };
    const { data: responseData } = await api.post(`/classrooms`, requestData);

    return responseData;
  }, []);

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
  const deleteMultigrade = useCallback(async (multigrade: Multigrade) => {
    const api = createUnstableApi();
    const { id } = multigrade;

    await api.delete(`/classrooms/${id}`);
  }, []);

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
