import ToastContent from 'components/ToastContent';
import { Classroom } from 'models/Classroom';
import { useSession } from 'next-auth/client';
import { useCallback } from 'react';

import { initializeApi, useMutation, ProcessQueryDataFn } from 'services/api';

type CreateClassroomForm = {
  description: string;
  period: string;
  grade_id: string;
  school_id?: string;
  enroll_count: number;
  grade: {
    description: string;
  };
  class_period: {
    description: string;
  };
};

export function useAddClassroom(queries: Record<string, ProcessQueryDataFn>) {
  const [session] = useSession();

  const addClassroom = useCallback(
    async (values: CreateClassroomForm) => {
      const api = initializeApi(session);
      const {
        enroll_count: _enroll_count,
        grade: _grade,
        class_period: _class_period,
        school_id,
        ...data
      } = values;

      const requestData = {
        ...data,
        school_year_id: session?.configs.school_year_id
      };
      const { data: responseData } = await api.post(
        `/schools/${school_id || 'me'}/classrooms`,
        requestData
      );

      return responseData;
    },
    [session]
  );

  return useMutation('add-classroom', addClassroom, {
    linkedQueries: queries,
    renderLoading: function render(newClassroom) {
      return (
        <ToastContent showSpinner>
          Salvando {newClassroom.description}...
        </ToastContent>
      );
    },
    renderError: (newClassroom) =>
      `Falha ao salvar ${newClassroom.description}`,
    renderSuccess: (newClassroom) =>
      `${newClassroom.description} salvo com sucesso.`
  });
}

export function useDeleteClassroom(
  queries: Record<string, ProcessQueryDataFn>
) {
  const [session] = useSession();

  const deleteClassroom = useCallback(
    async (classroom: Classroom) => {
      const api = initializeApi(session);
      const { school_id, id } = classroom;

      await api.delete(`/schools/${school_id || 'me'}/classrooms/${id}`);
    },
    [session]
  );

  return useMutation('delete-classroom', deleteClassroom, {
    linkedQueries: queries,
    renderLoading: function render(classroom) {
      return (
        <ToastContent showSpinner>
          Apagando {classroom.description}...
        </ToastContent>
      );
    },
    renderError: (classroom) => `Falha ao apagar ${classroom.description}`,
    renderSuccess: (classroom) =>
      `${classroom.description} apagado com sucesso.`
  });
}
