import { useCallback } from 'react';
import { useSession } from 'next-auth/client';

import ToastContent from 'components/ToastContent';

import {
  DefineSchoolClassPeriodRequest,
  SchoolClassPeriod
} from 'models/SchoolClassPeriod';

import { initializeApi, useMutation } from 'services/api';

type DefineSchoolClassPeriodsProps = {
  showToasts?: boolean;
};
export function useDefineSchoolClassPeriods({
  showToasts
}: DefineSchoolClassPeriodsProps = {}) {
  const [session] = useSession();

  const defineSchoolClassPeriod = useCallback(
    async (values: DefineSchoolClassPeriodRequest) => {
      const api = initializeApi(session);

      const { school_id, ...data } = values;

      const { data: responseData } = await api.post<SchoolClassPeriod[]>(
        `/schools/${school_id}/class-periods`,
        data
      );

      return responseData;
    },
    [session]
  );

  return useMutation('define-school-class-period', defineSchoolClassPeriod, {
    renderLoading: showToasts
      ? function render() {
          return <ToastContent showSpinner>Salvando...</ToastContent>;
        }
      : undefined,
    renderError: showToasts ? () => `Falha ao salvar alterações` : undefined,
    renderSuccess: showToasts
      ? () => `Alterações registradas com sucesso.`
      : undefined
  });
}
