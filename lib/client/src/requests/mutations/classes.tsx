import { useCallback } from 'react';
import { useSession } from 'next-auth/react';

import ToastContent from 'components/ToastContent';

import { Class } from 'models/Class';
import { SchoolTerm } from 'models/SchoolTerm';

import { initializeApi, useMutation } from 'services/api';

type CreateClassRequestData = {
  classroom_id: string;
  school_subject_id: string;
  period: string;
  class_date: Date | string;
  taught_content: string;
  school_term: SchoolTerm;
};

export function useCreateClass() {
  const { data: session } = useSession();

  const createClass = useCallback(
    async (values: CreateClassRequestData) => {
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
  const { data: session } = useSession();

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
