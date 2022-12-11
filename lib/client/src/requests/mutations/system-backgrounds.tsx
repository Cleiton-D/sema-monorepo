import { useCallback } from 'react';
import getConfig from 'next/config';
import { useSession } from 'next-auth/react';

import ToastContent from 'components/ToastContent';

import { SystemBackground } from 'models/SystemBackground';

import { initializeApi, useMutation } from 'services/api';

type SetCurrentSystemBackgroundRequestData = {
  system_background_id: string;
  is_defined: boolean;
};

const { publicRuntimeConfig } = getConfig();

export function useChangeCurrentSystemBackgroundMutation() {
  const { data: session } = useSession();

  const changeCurrentSystemBackground = useCallback(
    async (values: SetCurrentSystemBackgroundRequestData) => {
      const api = initializeApi(session);

      const url = `${publicRuntimeConfig.NEXT_PUBLIC_APP_URL}/api/background`;
      const { data: responseData } = await api.patch<SystemBackground>(
        url,
        values
      );

      return responseData;
    },
    [session]
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
  const { data: session } = useSession();

  const createCurrentSystemBackground = useCallback(
    async (values: CreateCurrentSystemBackgroundRequestData) => {
      const api = initializeApi(session);

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const url = `${publicRuntimeConfig.NEXT_PUBLIC_APP_URL}/api/background`;
      const { data: responseData } = await api.post<SystemBackground>(
        url,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      return responseData;
    },
    [session]
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
  const { data: session } = useSession();

  const deleteSystemBackground = useCallback(
    ({ id }: SystemBackground) => {
      const api = initializeApi(session);

      const url = `${publicRuntimeConfig.NEXT_PUBLIC_APP_URL}/api/background/${id}`;
      return api.delete(url);
    },
    [session]
  );

  return useMutation('delete-system-background', deleteSystemBackground, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Removendo...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações`,
    renderSuccess: () => `Alterações registradas com sucesso.`
  });
}
