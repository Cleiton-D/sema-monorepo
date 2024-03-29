import { useCallback } from 'react';

import ToastContent from 'components/ToastContent';
import { ModalRef } from 'components/Modal';

import { SchoolTeacher } from 'models/SchoolTeacher';

import { createUnstableApi, useMutation } from 'services/api';
import { TeacherSchoolSubject } from 'models/TeacherSchoolSubject';

type AddTeacherToSchoolForm = {
  school_id: string;
  employee_id: string;
  school_subject_id: string;
};

export function useAddTeacherToSchoolSubjectMutation(
  modalRef: React.RefObject<ModalRef>
) {
  const addTeacherToSchoolSubject = useCallback(
    async (values: AddTeacherToSchoolForm) => {
      const api = createUnstableApi();

      const { school_id, ...data } = values;

      const { data: responseData } = await api.post<SchoolTeacher>(
        `/schools/${school_id}/teacher-school-subjects`,
        data
      );

      return responseData;
    },
    []
  );

  return useMutation(
    'add-teacher-to-school-subject',
    addTeacherToSchoolSubject,
    {
      onMutate: () => modalRef.current?.closeModal(),
      renderLoading: function render() {
        return <ToastContent showSpinner>Salvando...</ToastContent>;
      },
      renderError: () => `Falha ao salvar alterações`,
      renderSuccess: () => `Alterações registradas com sucesso.`
    }
  );
}

export function useDeleteTeacherSchoolSubject() {
  const deleteTeacherSchoolSubject = useCallback(
    async (teacherSchoolSubject: TeacherSchoolSubject) => {
      const api = createUnstableApi();

      const { id, school_id } = teacherSchoolSubject;

      const response = await api.delete(
        `/schools/${school_id}/teacher-school-subjects/${id}`
      );
      return response;
    },
    []
  );

  return useMutation(
    'delete-teacher-school-subject',
    deleteTeacherSchoolSubject,
    {
      renderLoading: function render(
        deletedTeacherSchoolSubject: TeacherSchoolSubject
      ) {
        return (
          <ToastContent showSpinner>
            Removendo {deletedTeacherSchoolSubject.employee.name}...
          </ToastContent>
        );
      },
      renderError: (deletedTeacherSchoolSubject: TeacherSchoolSubject) =>
        `Falha ao remover ${deletedTeacherSchoolSubject.employee.name}`,
      renderSuccess: (deletedTeacherSchoolSubject: TeacherSchoolSubject) =>
        `${deletedTeacherSchoolSubject.employee.name} removido com sucesso.`
    }
  );
}
