import { useCallback } from 'react';
import { useSession } from 'next-auth/client';

import ToastContent from 'components/ToastContent';
import { ModalRef } from 'components/Modal';

import { SchoolTeacher } from 'models/SchoolTeacher';

import { initializeApi, useMutation } from 'services/api';

type AddTeacherToSchoolForm = {
  school_id: string;
  employee_id: string;
};

export function useAddTeacherToSchoolMutation(
  modalRef: React.RefObject<ModalRef>
) {
  const [session] = useSession();

  const addTeacherToSchool = useCallback(
    async (values: AddTeacherToSchoolForm) => {
      const api = initializeApi(session);

      const { school_id, ...data } = values;

      const { data: responseData } = await api.post<SchoolTeacher>(
        `/schools/${school_id}/teachers`,
        data
      );

      return responseData;
    },
    [session]
  );

  return useMutation('add-teacher-to-school', addTeacherToSchool, {
    onMutate: () => modalRef.current?.closeModal(),
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações`,
    renderSuccess: () => `Alterações registradas com sucesso.`
  });
}

export function useDeleteSchoolTeacher() {
  const [session] = useSession();

  const deleteSchoolTeacher = useCallback(
    async (schoolTeacher: SchoolTeacher) => {
      const api = initializeApi(session);

      const { id, school_id } = schoolTeacher;

      const response = await api.delete(`/schools/${school_id}/teachers/${id}`);
      return response;
    },
    [session]
  );

  return useMutation('delete-school-teacher', deleteSchoolTeacher, {
    renderLoading: function render(deletedSchoolTeacher: SchoolTeacher) {
      return (
        <ToastContent showSpinner>
          Removendo {deletedSchoolTeacher.employee.person.name}...
        </ToastContent>
      );
    },
    renderError: (deletedSchoolTeacher: SchoolTeacher) =>
      `Falha ao remover ${deletedSchoolTeacher.employee.person.name}`,
    renderSuccess: (deletedSchoolTeacher: SchoolTeacher) =>
      `${deletedSchoolTeacher.employee.person.name} removido com sucesso.`
  });
}
