import { useCallback } from 'react';
import { useSession } from 'next-auth/react';

import ToastContent from 'components/ToastContent';

import { Attendance } from 'models/Attendance';

import { initializeApi, useMutation } from 'services/api';

type RegisterAttendancesFormData = {
  class_id: string;
  attendances: Array<{
    enroll_id: string;
    attendance: boolean;
  }>;
};

export function useRegisterAttendances() {
  const { data: session } = useSession();

  const registerAttendances = useCallback(
    async (values: RegisterAttendancesFormData) => {
      const api = initializeApi(session);

      const { data: responseData } = await api.put<Attendance[]>(
        `/attendances`,
        values
      );

      return responseData;
    },
    [session]
  );

  return useMutation('register-attendances', registerAttendances, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}
