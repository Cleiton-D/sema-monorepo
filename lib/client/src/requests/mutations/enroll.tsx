import { useCallback } from 'react';
import { useSession } from 'next-auth/client';

import ToastContent from 'components/ToastContent';

import { CompleteEnrollFormData } from 'models/Enroll';

import { initializeApi, useMutation } from 'services/api';

type CreateEnrollForm = CompleteEnrollFormData & {
  school_id: string;
};

export function useCreateEnroll() {
  const [session] = useSession();

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
          Salvando {newEnroll.person.name}...
        </ToastContent>
      );
    },
    renderError: () => `Falha ao realizar a matrícula.`,
    renderSuccess: () => `Matrícula realizada com sucesso.`
  });
}
