import { RefObject, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ModalRef } from 'components/Modal';
import ToastContent from 'components/ToastContent';

import { createUnstableApi, useMutation } from 'services/api';
import { FormattedUser } from 'models/User';

export function useAddUserMutation(modalRef: RefObject<ModalRef>) {
  const addUser = useCallback(async (values: any) => {
    const api = createUnstableApi();
    return api.post('/users', values);
  }, []);

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

export function useDeleteUserMutation() {
  const deleteUser = useCallback(async (user: FormattedUser) => {
    const api = createUnstableApi();

    return api.delete(`/users/${user.id}`);
  }, []);

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

type ResetPasswordRequest = {
  user_id: string;
};
export function useResetPassword() {
  const resetPassword = useCallback(
    async ({ user_id }: ResetPasswordRequest) => {
      const api = createUnstableApi();

      return api.patch(`/users/reset-pass`, { user_id });
    },
    []
  );

  return useMutation('reset-password', resetPassword, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Resetando senha...</ToastContent>;
    },
    renderError: () => `Falha ao resetar a senha`,
    renderSuccess: () => `Senha resetada com sucesso`
  });
}
