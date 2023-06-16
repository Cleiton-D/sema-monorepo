import { useCallback } from 'react';

import ToastContent from 'components/ToastContent';

import { SystemBackground } from 'models/SystemBackground';

import { createUnstableApi, useMutation } from 'services/api';

type SetCurrentSystemBackgroundRequestData = {
  system_background_id: string;
  is_defined: boolean;
};

export function useChangeCurrentSystemBackgroundMutation() {
  const changeCurrentSystemBackground = useCallback(
    async (values: SetCurrentSystemBackgroundRequestData) => {
      const api = createUnstableApi();

      const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/background`;
      const { data: responseData } = await api.patch<SystemBackground>(
        url,
        values
      );

      return responseData;
    },
    []
  );

  return useMutation(
    'change-current-system-background',
    changeCurrentSystemBackground,
    {
      renderLoading: function render() {
        return <ToastContent showSpinner>Salvando...</ToastContent>;
      },
      renderError: () => `Falha ao salvar alterações`,
      renderSuccess: () => `Alterações registradas com sucesso.`
    }
  );
}

type CreateCurrentSystemBackgroundRequestData = {
  image: File;
};
export function useCreateCurrentSystemBackgroundMutation() {
  const createCurrentSystemBackground = useCallback(
    async (values: CreateCurrentSystemBackgroundRequestData) => {
      const api = createUnstableApi();

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/background`;
      const { data: responseData } = await api.post<SystemBackground>(
        url,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      return responseData;
    },
    []
  );

  return useMutation(
    'create-current-system-background',
    createCurrentSystemBackground,
    {
      renderLoading: function render() {
        return <ToastContent showSpinner>Salvando...</ToastContent>;
      },
      renderError: () => `Falha ao salvar alterações`,
      renderSuccess: () => `Alterações registradas com sucesso.`
    }
  );
}

export function useDeleteSystemBackgroundMutation() {
  const deleteSystemBackground = useCallback(({ id }: SystemBackground) => {
    const api = createUnstableApi();

    const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/background/${id}`;
    return api.delete(url);
  }, []);

  return useMutation('delete-system-background', deleteSystemBackground, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Removendo...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações`,
    renderSuccess: () => `Alterações registradas com sucesso.`
  });
}
