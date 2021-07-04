import { RefObject, useCallback } from 'react';
import { Session } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';

import ToastContent from 'components/ToastContent';
import { ModalRef } from 'components/Modal';

import { initializeApi, useMutation } from 'services/api';
import { AccessLevel } from 'models/AccessLevel';

export function useAddAccessLevelMutation(
  modalRef: RefObject<ModalRef>,
  session?: Session | null
) {
  const addAccessLevel = useCallback(
    async (values) => {
      const api = initializeApi(session);
      return api.post('/app/access-levels', values);
    },
    [session]
  );

  return useMutation('add-access-levels', addAccessLevel, {
    linkedQueries: {
      'get-access-levels': (old, newAccessLevel) => [
        ...old,
        { ...newAccessLevel, id: uuidv4(), disabled: true }
      ]
    },
    onMutate: () => modalRef.current?.closeModal(),
    renderLoading: function render(newAccessLevel) {
      return (
        <ToastContent showSpinner>
          Salvando o nível de acesso {newAccessLevel.description}...
        </ToastContent>
      );
    },
    renderError: (newAccessLevel) =>
      `Falha ao inserir o nível de acesso ${newAccessLevel.description}`,
    renderSuccess: (newAccessLevel) =>
      `${newAccessLevel.description} inserido com sucesso`
  });
}

export function useDeleteAccessLevelMutation(session?: Session | null) {
  const deleteAccessLevel = useCallback(
    async (accessLevel) => {
      const api = initializeApi(session);
      return api.delete(`/app/access-levels/${accessLevel.id}`);
    },
    [session]
  );

  return useMutation('delete-access-levels', deleteAccessLevel, {
    linkedQueries: {
      'get-access-levels': (
        old: AccessLevel[],
        deleteAccessLevel: AccessLevel
      ) =>
        old.map((accessLevel) =>
          accessLevel.id === deleteAccessLevel.id
            ? { ...accessLevel, disabled: true }
            : accessLevel
        )
    },
    renderLoading: function render(deleteAccessLevel) {
      return (
        <ToastContent showSpinner>
          Removendo {deleteAccessLevel.description} ...
        </ToastContent>
      );
    },
    renderError: (deleteAccessLevel) =>
      `Falha ao remover ${deleteAccessLevel.description}`,
    renderSuccess: (deleteAccessLevel) =>
      `${deleteAccessLevel.description} removido com sucesso`
  });
}
