import { useCallback } from 'react';
import { useSession } from 'next-auth/react';

import ToastContent from 'components/ToastContent';

import { StudentForm } from 'models/Student';

import { initializeApi, useMutation } from 'services/api';

type UpdateStudentForm = StudentForm & {
  student_id: string;
};

export function useUpdateStudent() {
  const { data: session } = useSession();

  const updateStudent = useCallback(
    async (data: UpdateStudentForm) => {
      const api = initializeApi(session);

      const { student_id, ...requestData } = data;

      const { data: responseData } = await api.put(
        `/students/${student_id}`,
        requestData
      );
      return responseData;
    },
    [session]
  );

  return useMutation('update-student', updateStudent, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}
