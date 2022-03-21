import { useCallback } from 'react';
import { useSession } from 'next-auth/react';

import ToastContent from 'components/ToastContent';

import { CompleteEnrollFormData } from 'models/Enroll';

import { initializeApi, useMutation } from 'services/api';

type CreateEnrollForm = CompleteEnrollFormData & {
  school_id: string;
};

export function useCreateEnroll() {
  const { data: session } = useSession();

  const createEnroll = useCallback(
    async (data: CreateEnrollForm) => {
      const api = initializeApi(session);

      const requestData = {
        ...data,
        school_year_id: session?.configs.school_year_id
      };

      const { data: responseData } = await api.post('/enrolls', requestData);
      return responseData;
    },
    [session]
  );

  return useMutation('create-enroll', createEnroll, {
    renderLoading: function render(newEnroll) {
      return (
        <ToastContent showSpinner>
          Salvando {newEnroll.student.name}...
        </ToastContent>
      );
    },
    renderError: () => `Falha ao realizar a matrícula.`,
    renderSuccess: () => `Matrícula realizada com sucesso.`
  });
}

export type UpdateEnrollData = Record<string, any> & {
  enroll_id: string;
};
export function useUpdateEnroll() {
  const { data: session } = useSession();

  const updateEnroll = useCallback(
    async (data: UpdateEnrollData) => {
      const api = initializeApi(session);

      const { enroll_id, ...requestData } = data;

      const { data: responseData } = await api.put(
        `/enrolls/${enroll_id}`,
        requestData
      );
      return responseData;
    },
    [session]
  );

  return useMutation('update-enroll', updateEnroll, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao alterar a matrícula.`,
    renderSuccess: () => `Matrícula alterada com sucesso.`
  });
}

type RelocateEnrollData = {
  enroll_id: string;
  from: string;
  to: string;
};
export function useRelocateEnroll() {
  const { data: session } = useSession();

  const relocateEnroll = useCallback(
    async (data: RelocateEnrollData) => {
      const api = initializeApi(session);

      const { enroll_id, ...requestData } = data;

      const { data: responseData } = await api.patch(
        `/enrolls/${enroll_id}`,
        requestData
      );
      return responseData;
    },
    [session]
  );

  return useMutation('relocate-enroll', relocateEnroll, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Realocando...</ToastContent>;
    },
    renderError: () => `Falha ao realocar a matrícula.`,
    renderSuccess: () => `Matrícula realocada com sucesso.`
  });
}
