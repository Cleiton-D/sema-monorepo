import { RefObject, useCallback } from 'react';
import { useSession } from 'next-auth/react';

import { initializeApi, useApi, useMutation } from 'services/api';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import {
  FormattedClassPeriod,
  ClassPeriodForm,
  ClassPeriod
} from 'models/ClassPeriod';

import { ModalRef } from 'components/Modal';
import ToastContent from 'components/ToastContent';

export function useMutateClassPeriod(modalRef: RefObject<ModalRef>) {
  const { data: session } = useSession();

  const mutateClassPeriod = useCallback(
    async (values: ClassPeriodForm) => {
      const api = initializeApi(session);

      const { data: responseData } = await api.post<ClassPeriod[]>(
        '/education/admin/class-periods',
        values
      );

      return responseData;
    },
    [session]
  );

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
  const { data: session } = useSession();
  const api = useApi(session);

  const deleteClassPeriod = useCallback(
    async (classPeriod: FormattedClassPeriod) => {
      const { id } = classPeriod;
      await api.delete(`/education/admin/class-periods/${id}`);
    },
    [api]
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
