import { useCallback } from 'react';
import { toast } from 'sonner';

import { SchoolYear } from 'models/SchoolYear';

import ToastContent from 'components/ToastContent';

import { createUnstableApi, useMutation } from 'services/api';

type FinishSchoolYearParams = {
  schoolYearId: string;
  login: string;
  password: string;
};

export const useFinishSchoolYear = () => {
  const finishSchoolYear = useCallback(
    async ({ login, password, schoolYearId }: FinishSchoolYearParams) => {
      const api = createUnstableApi();

      const { data: response } = await api
        .post(`/sessions`, {
          login,
          password
        })
        .catch((err) => {
          console.log(err);
          toast.error('Não foi possível realizar a autenticação', {
            position: 'top-right',
            dismissible: false,
            duration: 3000
          });
          return err;
        });

      if (!response.token) {
        toast.error('Não foi possível realizar a autenticação', {
          position: 'top-right',
          dismissible: false,
          duration: 3000
        });
      }

      return api
        .patch<SchoolYear>(
          `/education/admin/school-years/${schoolYearId}`,
          undefined,
          {
            headers: {
              authorization: `Bearer ${response.token}`
            }
          }
        )
        .then((res) => res.data)
        .catch(() =>
          toast.error('Ocorreu um erro ao encerrar o ano letivo.', {
            position: 'top-right',
            dismissible: false,
            duration: 3000
          })
        );
    },
    []
  );

  return useMutation('finish-school-year', finishSchoolYear, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Encerrando ano letivo...</ToastContent>;
    },
    renderError: () => `Falha ao encerrar ano letivo`,
    renderSuccess: () => `Ano letivo encerrado com sucesso`
  });
};
