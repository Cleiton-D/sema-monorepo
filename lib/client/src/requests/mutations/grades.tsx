import { useCallback } from 'react';

import ToastContent from 'components/ToastContent';

import { createUnstableApi, useMutation } from 'services/api';

import { Grade } from 'models/Grade';

export function useAddGradeMutation(onMutate: () => void) {
  const addGrade = useCallback(async (values: any) => {
    const api = createUnstableApi();
    return api.post('/education/admin/grades', values);
  }, []);

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

export function useDeleteGradeMutation() {
  const deleteGrade = useCallback(async (grade: Grade) => {
    const api = createUnstableApi();

    return api.delete(`/education/admin/grades/${grade.id}`);
  }, []);

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
