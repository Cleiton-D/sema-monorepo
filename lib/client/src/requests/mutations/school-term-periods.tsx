import { useCallback } from 'react';
import { useSession } from 'next-auth/react';

import ToastContent from 'components/ToastContent';

import { SchoolTermPeriod } from 'models/SchoolTermPeriod';

import { initializeApi, useMutation } from 'services/api';

type UpdateSchoolTermPeriodForm = {
  id: string;
  date_start?: string;
  date_end?: string;
  status: string;
};

export function useUpdateSchoolTermPeriod() {
  const { data: session } = useSession();

  const updateSchoolTermPeriod = useCallback(
    async (values: UpdateSchoolTermPeriodForm) => {
      const api = initializeApi(session);

      const { id, ...data } = values;

      const { data: responseData } = await api.put<SchoolTermPeriod>(
        `/education/admin/school-term-periods/${id}`,
        data
      );

      return responseData;
    },
    [session]
  );

  return useMutation('update-school-term-periods', updateSchoolTermPeriod, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações`,
    renderSuccess: () => `Alterações registradas com sucesso.`
  });
}
