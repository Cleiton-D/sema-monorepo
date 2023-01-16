import { useCallback } from 'react';
import { Session } from 'next-auth';

import ToastContent from 'components/ToastContent';

import { initializeApi, useMutation } from 'services/api';

import { Grade } from 'models/Grade';

export function useAddGradeMutation(
  onMutate: () => void,
  session?: Session | null
) {
  const addGrade = useCallback(
    async (values: any) => {
      const api = initializeApi(session);
      return api.post('/education/admin/grades', values);
    },
    [session]
  );

  return useMutation('add-grades', addGrade, {
    onMutate: onMutate,
    renderLoading: function render(newGrade) {
      return (
        <ToastContent showSpinner>
          Salvando a série {newGrade.description}...
        </ToastContent>
      );
    },
    renderError: (newGrade) =>
      `Falha ao inserir a série ${newGrade.description}`,
    renderSuccess: (newGrade) => `${newGrade.description} inserido com sucesso`
  });
}

export function useDeleteGradeMutation(session?: Session | null) {
  const deleteGrade = useCallback(
    async (grade: Grade) => {
      const api = initializeApi(session);

      return api.delete(`/education/admin/grades/${grade.id}`);
    },
    [session]
  );

  return useMutation('delete-grade', deleteGrade, {
    renderLoading: function render(deletedGrade) {
      return (
        <ToastContent showSpinner>
          Removendo {deletedGrade.description}...
        </ToastContent>
      );
    },
    renderError: (deletedGrade) =>
      `Falha ao remover ${deletedGrade.description}`,
    renderSuccess: (deletedGrade) =>
      `${deletedGrade.description} removido com sucesso`
  });
}
