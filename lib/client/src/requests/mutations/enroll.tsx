import { useCallback } from 'react';

import ToastContent from 'components/ToastContent';

import { CompleteEnrollFormData } from 'models/Enroll';

import { createUnstableApi, useMutation } from 'services/api';

type CreateEnrollForm = CompleteEnrollFormData & {
  school_id: string;
  school_year_id: string;
};

export function useCreateEnroll() {
  const createEnroll = useCallback(async (data: CreateEnrollForm) => {
    const api = createUnstableApi();

    const requestData = {
      ...data
    };

    const { data: responseData } = await api.post('/enrolls', requestData);
    return responseData;
  }, []);

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
  const updateEnroll = useCallback(async (data: UpdateEnrollData) => {
    const api = createUnstableApi();

    const { enroll_id, ...requestData } = data;

    const { data: responseData } = await api.put(
      `/enrolls/${enroll_id}`,
      requestData
    );
    return responseData;
  }, []);

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
  const relocateEnroll = useCallback(async (data: RelocateEnrollData) => {
    const api = createUnstableApi();

    const { enroll_id, ...requestData } = data;

    const { data: responseData } = await api.patch(
      `/enrolls/${enroll_id}`,
      requestData
    );
    return responseData;
  }, []);

  return useMutation('relocate-enroll', relocateEnroll, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Realocando...</ToastContent>;
    },
    renderError: () => `Falha ao realocar a matrícula.`,
    renderSuccess: () => `Matrícula realocada com sucesso.`
  });
}
