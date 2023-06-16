import { useCallback } from 'react';

import ToastContent from 'components/ToastContent';

import { StudentForm } from 'models/Student';

import { createUnstableApi, useMutation } from 'services/api';

type UpdateStudentForm = StudentForm & {
  student_id: string;
};

export function useUpdateStudent() {
  const updateStudent = useCallback(async (data: UpdateStudentForm) => {
    const api = createUnstableApi();

    const { student_id, ...requestData } = data;

    const { data: responseData } = await api.put(
      `/students/${student_id}`,
      requestData
    );
    return responseData;
  }, []);

  return useMutation('update-student', updateStudent, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}
