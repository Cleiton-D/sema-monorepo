import { useCallback } from 'react';

import ToastContent from 'components/ToastContent';

import { createUnstableApi, useMutation } from 'services/api';

type CreateUserProfileForm = {
  user_id: string;
  branch_id: string;
  access_level_id?: string;
  accessCode?: string;
};

type DeleteUserProfileData = {
  id?: string;
  user_id?: string;
  branch_id?: string;
  access_level_id?: string;
  accessCode?: string;
};

export function useCreateUserProfile() {
  const createUserProfile = useCallback(
    async (values: CreateUserProfileForm) => {
      const api = createUnstableApi();

      const { data: responseData } = await api.post(`/user-profiles`, values);

      return responseData;
    },
    []
  );

  return useMutation('create-user-profile', createUserProfile, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações`,
    renderSuccess: () => `Alterações registradas com sucesso.`
  });
}

type DeleteUserProfileOptions = {
  showToasts?: boolean;
};
export function useDeleteUserProfile({
  showToasts = true
}: DeleteUserProfileOptions = {}) {
  const deleteUserProfile = useCallback(
    async (values: DeleteUserProfileData) => {
      const api = createUnstableApi();

      const { id, ...data } = values;
      if (id) return api.delete(`/user-profiles/${id}`);

      return api.delete(`/user-profiles`, {
        data
      });
    },
    []
  );

  return useMutation('create-user-profile', deleteUserProfile, {
    renderLoading: showToasts
      ? function render() {
          return <ToastContent showSpinner>Removendo...</ToastContent>;
        }
      : undefined,
    renderError: showToasts ? () => `Falha ao salvar alterações` : undefined,
    renderSuccess: showToasts
      ? () => `Alterações registradas com sucesso.`
      : undefined
  });
}
