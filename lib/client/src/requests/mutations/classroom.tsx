import { useCallback } from 'react';

import ToastContent from 'components/ToastContent';

import { ClassPeriod } from 'models/ClassPeriod';
import { Classroom } from 'models/Classroom';

import {
  useMutation,
  ProcessQueryDataFn,
  createUnstableApi
} from 'services/api';

type CreateClassroomForm = {
  id?: string;
  description: string;
  period: string;
  grade_id: string;
  school_id?: string;
  school_year_id: string;
  enroll_count: number;
  is_multigrade?: boolean;
  is_multidisciplinary?: boolean;
  grade: {
    description: string;
  };
  class_period: ClassPeriod;
};

export function useAddClassroom(queries: Record<string, ProcessQueryDataFn>) {
  const addClassroom = useCallback(async (values: CreateClassroomForm) => {
    const api = createUnstableApi();
    const { enroll_count: _enroll_count, grade: _grade, id, ...data } = values;

    const requestData = {
      ...data
    };

    const { data: responseData } = id
      ? await api.put(`/classrooms/${id}`, requestData)
      : await api.post(`/classrooms`, requestData);

    return responseData;
  }, []);

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
  const deleteClassroom = useCallback(async (classroom: Classroom) => {
    const api = createUnstableApi();
    const { id } = classroom;

    await api.delete(`/classrooms/${id}`);
  }, []);

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
