import { useCallback } from 'react';
import { useSession } from 'next-auth/client';

import ToastContent from 'components/ToastContent';

import { SchoolReport } from 'models/SchoolReport';
import { SchoolTerm } from 'models/SchoolTerm';

import { initializeApi, useMutation } from 'services/api';

type RegisterSchoolReportsFormData = {
  school_subject_id: string;
  school_term: SchoolTerm;
  reports: Array<{ enroll_id: string; average: number }>;
};

export function useRegisterSchoolReports() {
  const [session] = useSession();

  const registerSchoolReports = useCallback(
    async (values: RegisterSchoolReportsFormData) => {
      const api = initializeApi(session);

      const { data: responseData } = await api.put<SchoolReport[]>(
        `/enrolls/reports`,
        values
      );

      return responseData;
    },
    [session]
  );

  return useMutation('register-school-reports', registerSchoolReports, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}
