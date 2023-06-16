import { useCallback } from 'react';

import ToastContent from 'components/ToastContent';

import { SchoolReport } from 'models/SchoolReport';

import { createUnstableApi, useMutation } from 'services/api';

type RegisterSchoolReportsFormData = {
  school_subject_id: string;
  reports: Array<{ enroll_id: string; averages: Record<string, number> }>;
};

export function useRegisterSchoolReports() {
  const registerSchoolReports = useCallback(
    async (values: RegisterSchoolReportsFormData) => {
      const api = createUnstableApi();
      const { data: responseData } = await api.put<SchoolReport[]>(
        `/enrolls/reports`,
        values
      );

      return responseData;
    },
    []
  );

  return useMutation('register-school-reports', registerSchoolReports, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}
