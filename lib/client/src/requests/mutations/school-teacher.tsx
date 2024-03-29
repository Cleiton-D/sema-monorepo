import { useCallback } from 'react';

import ToastContent from 'components/ToastContent';
import { ModalRef } from 'components/Modal';

import { SchoolTeacher } from 'models/SchoolTeacher';

import { createUnstableApi, useMutation } from 'services/api';

type AddTeacherToSchoolForm = {
  school_id: string;
  employee_id: string;
  school_year_id: string;
};

export function useAddTeacherToSchoolMutation(
  modalRef: React.RefObject<ModalRef>
) {
  const addTeacherToSchool = useCallback(
    async (values: AddTeacherToSchoolForm) => {
      const api = createUnstableApi();

      const { school_id, ...data } = values;

      const { data: responseData } = await api.post<SchoolTeacher>(
        `/schools/${school_id}/teachers`,
        data
      );

      return responseData;
    },
    []
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
  const deleteSchoolTeacher = useCallback(
    async (schoolTeacher: SchoolTeacher) => {
      const api = createUnstableApi();

      const { id, school_id } = schoolTeacher;

      const response = await api.delete(`/schools/${school_id}/teachers/${id}`);
      return response;
    },
    []
  );

  return useMutation('delete-school-teacher', deleteSchoolTeacher, {
    renderLoading: function render(deletedSchoolTeacher: SchoolTeacher) {
      return (
        <ToastContent showSpinner>
          Removendo {deletedSchoolTeacher.employee.name}...
        </ToastContent>
      );
    },
    renderError: (deletedSchoolTeacher: SchoolTeacher) =>
      `Falha ao remover ${deletedSchoolTeacher.employee.name}`,
    renderSuccess: (deletedSchoolTeacher: SchoolTeacher) =>
      `${deletedSchoolTeacher.employee.name} removido com sucesso.`
  });
}
