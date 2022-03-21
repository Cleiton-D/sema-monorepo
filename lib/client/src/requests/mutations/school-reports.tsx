import { useCallback } from 'react';
import { useSession } from 'next-auth/react';

import ToastContent from 'components/ToastContent';

import { SchoolReport } from 'models/SchoolReport';

import { useApi, useMutation } from 'services/api';

type RegisterSchoolReportsFormData = {
  school_subject_id: string;
  reports: Array<{ enroll_id: string; averages: Record<string, number> }>;
};

export function useRegisterSchoolReports() {
  const { data: session } = useSession();

  const api = useApi(session);

  const registerSchoolReports = useCallback(
    async (values: RegisterSchoolReportsFormData) => {
      const { data: responseData } = await api.put<SchoolReport[]>(
        `/enrolls/reports`,
        values
      );

      return responseData;
    },
    [api]
  );

  return useMutation('register-school-reports', registerSchoolReports, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}
