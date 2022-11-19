import { useCallback } from 'react';
import { useSession } from 'next-auth/react';

import ToastContent from 'components/ToastContent';
import { ModalRef } from 'components/Modal';

import { Classroom } from 'models/Classroom';
import { ClassroomTeacherSchoolSubject } from 'models/ClassroomTeacherSchoolSubject';

import { initializeApi, useMutation } from 'services/api';

type LinkClassroomTeacherSchoolSubjectForm = {
  classroom: Classroom;
  teacher_school_subjects: Array<{
    employee_id: string;
    school_subject_id: string;
    is_multidisciplinary?: boolean;
  }>;
};

export function useLinkClassroomTeacherSchoolSubject(
  modalRef?: React.RefObject<ModalRef>
) {
  const { data: session } = useSession();

  const linkClassroomTeacherSchoolSubject = useCallback(
    async (values: LinkClassroomTeacherSchoolSubjectForm) => {
      const api = initializeApi(session);

      const { classroom, ...requestData } = values;

      const requestBody = {
        ...requestData,
        classroom_id: classroom.id
      };

      const { data: responseData } = await api.post<
        ClassroomTeacherSchoolSubject[]
      >(`/classroom-teacher-school-subjects`, requestBody);

      return responseData;
    },
    [session]
  );

  return useMutation(
    'link-classroom-teacher-school-subject',
    linkClassroomTeacherSchoolSubject,
    {
      onMutate: () => modalRef?.current?.closeModal(),
      renderLoading: function render() {
        return <ToastContent showSpinner>Salvando...</ToastContent>;
      },
      renderError: () => `Falha ao salvar alterações`,
      renderSuccess: () => `Alterações registradas com sucesso.`
    }
  );
}

type DeleteClassroomTeacherSchoolSubjectProps = {
  classroomTeacherSchoolSubject: ClassroomTeacherSchoolSubject;
};

export function useDeleteClassroomTeacherSchoolSubject() {
  const { data: session } = useSession();

  const deleteClassroomTeacherSchoolSubject = useCallback(
    async ({
      classroomTeacherSchoolSubject
    }: DeleteClassroomTeacherSchoolSubjectProps) => {
      const api = initializeApi(session);

      await api.delete(
        `/classroom-teacher-school-subjects/${classroomTeacherSchoolSubject.id}`
      );
    },
    [session]
  );

  return useMutation(
    'delete-classroom-teacher-school-subject',
    deleteClassroomTeacherSchoolSubject,
    {
      renderLoading: function render() {
        return <ToastContent showSpinner>Salvando...</ToastContent>;
      },
      renderError: () => `Falha ao salvar alterações`,
      renderSuccess: () => `Alterações registradas com sucesso.`
    }
  );
}
