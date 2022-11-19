import { useCallback } from 'react';
import { useSession } from 'next-auth/react';

import ToastContent from 'components/ToastContent';

import { Class } from 'models/Class';
import { SchoolTerm } from 'models/SchoolTerm';

import { initializeApi, isApiError, useMutation } from 'services/api';

type CreateClassRequestData = {
  classroom_id: string;
  school_subject_id: string;
  period: string;
  class_date: Date | string;
  taught_content: string;
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
    renderError: (_, error) => {
      if (isApiError(error)) {
        const alreadyExists =
          error.response?.data.message ===
          'Already exist a class registered for you in this period';

        if (alreadyExists) {
          return 'Já existe uma aula cadastrada para você nesse dia e horário!';
        }
      }

      return `Falha ao registrar aula.`;
    },
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

type EditClassRequestData = {
  class_id: string;
  school_subject_id: string;
  period: string;
  class_date: Date | string;
  taught_content: string;
  school_term: SchoolTerm;
};

export function useEditClass() {
  const { data: session } = useSession();

  const editClass = useCallback(
    async (values: EditClassRequestData) => {
      const api = initializeApi(session);

      const { class_id, ...requestData } = values;

      const { data: responseData } = await api.put(
        `/classes/${class_id}`,
        requestData
      );
      return responseData;
    },
    [session]
  );

  return useMutation('edit-class', editClass, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao realizar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}

export function useDeleteClass() {
  const { data: session } = useSession();

  const deleteClass = useCallback(
    async (classEntity: Class) => {
      const api = initializeApi(session);

      const { id } = classEntity;

      const { data: responseData } = await api.delete(`/classes/${id}`);
      return responseData;
    },
    [session]
  );

  return useMutation('delete-class', deleteClass, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao realizar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}
