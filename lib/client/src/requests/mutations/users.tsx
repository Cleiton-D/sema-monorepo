import { Session } from 'next-auth';
import { RefObject, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ModalRef } from 'components/Modal';

import { initializeApi, useMutation } from 'services/api';
import { FormattedUser } from 'models/User';

import ToastContent from 'components/ToastContent';

export function useAddUserMutation(
  modalRef: RefObject<ModalRef>,
  session?: Session | null
) {
  const addUser = useCallback(
    async (values) => {
      const api = initializeApi(session);
      return api.post('/users', values);
    },
    [session]
  );

  return useMutation('add-user', addUser, {
    linkedQueries: {
      'get-users': (old, newUser) => [
        ...old,
        { ...newUser, id: uuidv4(), disabled: true }
      ]
    },
    onMutate: () => modalRef.current?.closeModal(),
    renderLoading: function render(newUser) {
      return (
        <ToastContent showSpinner>
          Salvando usuário {newUser.username}...
        </ToastContent>
      );
    },
    renderError: (newUser) => `Falha ao inserir usuário ${newUser.username}`,
    renderSuccess: (newUser) =>
      `Usuário ${newUser.username} inserido com sucesso`
  });
}

export function useDeleteUserMutation(session?: Session | null) {
  const deleteUser = useCallback(
    async (user: FormattedUser) => {
      const api = initializeApi(session);

      return api.delete(`/users/${user.id}`);
    },
    [session]
  );

  return useMutation('delete-user', deleteUser, {
    linkedQueries: {
      'get-users': (old: FormattedUser[], deletedUser: FormattedUser) =>
        old.map((user) =>
          user.id === deletedUser.id ? { ...user, disabled: true } : user
        )
    },
    renderLoading: function render(deletedUser) {
      return (
        <ToastContent showSpinner>
          Removendo usuário {deletedUser.username}...
        </ToastContent>
      );
    },
    renderError: (deletedUser) =>
      `Falha ao remover usuário ${deletedUser.username}`,
    renderSuccess: (deletedUser) =>
      `Usuário ${deletedUser.username} removido com sucesso`
  });
}
