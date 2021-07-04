import { useCallback } from 'react';
import { useSession } from 'next-auth/client';

import ToastContent from 'components/ToastContent';

import { initializeApi, useMutation } from 'services/api';
import { Class } from 'models/Class';

export function useCreateClass() {
  const [session] = useSession();

  const createClass = useCallback(
    async (values) => {
      const api = initializeApi(session);

      const { data: responseData } = await api.post('/classes', values);
      return responseData;
    },
    [session]
  );

  return useMutation('create-class', createClass, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao registrar aula.`,
    renderSuccess: () => `Aula iniciada com sucesso.`
  });
}

export function useFinishClass() {
  const [session] = useSession();

  const finishClass = useCallback(
    async (classEntity: Class) => {
      const api = initializeApi(session);

      const { data: responseData } = await api.put(
        `/classes/${classEntity.id}/finish`
      );
      return responseData;
    },
    [session]
  );

  return useMutation('finish-class', finishClass, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao encerrar aula.`,
    renderSuccess: () => `Aula encerrada com sucesso.`
  });
}
