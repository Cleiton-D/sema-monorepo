import { RefObject, useCallback } from 'react';

import { createUnstableApi, useMutation } from 'services/api';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import {
  FormattedClassPeriod,
  ClassPeriodForm,
  ClassPeriod
} from 'models/ClassPeriod';

import { ModalRef } from 'components/Modal';
import ToastContent from 'components/ToastContent';

export function useMutateClassPeriod(modalRef: RefObject<ModalRef>) {
  const mutateClassPeriod = useCallback(async (values: ClassPeriodForm) => {
    const api = createUnstableApi();

    const { data: responseData } = await api.post<ClassPeriod[]>(
      '/education/admin/class-periods',
      values
    );

    return responseData;
  }, []);

  return useMutation('create-class-period', mutateClassPeriod, {
    onMutate: () => modalRef.current?.closeModal(),
    renderLoading: function render(newClassPeriod) {
      return (
        <ToastContent showSpinner>
          Salvando período {translateDescription(newClassPeriod.description)}...
        </ToastContent>
      );
    },
    renderError: () => `Falha ao salvar período`,
    renderSuccess: () => `Período cadastrado com sucesso`
  });
}

export function useDeleteClassPeriod() {
  const deleteClassPeriod = useCallback(
    async (classPeriod: FormattedClassPeriod) => {
      const { id } = classPeriod;

      const api = createUnstableApi();
      await api.delete(`/education/admin/class-periods/${id}`);
    },
    []
  );

  return useMutation('delete-class-period', deleteClassPeriod, {
    renderLoading: function render(newClassPeriod) {
      return (
        <ToastContent showSpinner>
          Removendo período {translateDescription(newClassPeriod.description)}
          ...
        </ToastContent>
      );
    },
    renderError: (newClassPeriod) =>
      `Falha ao remover período ${translateDescription(
        newClassPeriod.description
      )}`,
    renderSuccess: (newClassPeriod) =>
      `Período ${translateDescription(
        newClassPeriod.description
      )} removido com sucesso`
  });
}
