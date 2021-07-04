import { useCallback } from 'react';
import { useSession } from 'next-auth/client';

import ToastContent from 'components/ToastContent';
import { ModalRef } from 'components/Modal';

import {
  CreateGradeSchoolSubjectsRequest,
  GradeSchoolSubject,
  UpdateGradeSchoolSubjectsRequest
} from 'models/GradeSchoolSubject';

import { initializeApi, useMutation } from 'services/api';

export function useMutateGradeSchoolSubject(
  modalRef: React.RefObject<ModalRef>
) {
  const [session] = useSession();

  const mutateGradeSchoolSubject = useCallback(
    async (values: CreateGradeSchoolSubjectsRequest) => {
      const api = initializeApi(session);

      const { grade_id, ...data } = values;

      const { data: responseData } = await api.post<GradeSchoolSubject[]>(
        `/education/admin/grades/${grade_id}/school-subjects`,
        data
      );

      return responseData;
    },
    [session]
  );

  return useMutation('mutate-grade-school-subject', mutateGradeSchoolSubject, {
    onMutate: () => modalRef.current?.closeModal(),
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações`,
    renderSuccess: () => `Alterações registradas com sucesso.`
  });
}

export function useUpdateGradeSchoolSubject(
  modalRef: React.RefObject<ModalRef>
) {
  const [session] = useSession();

  const updateGradeSchoolSubject = useCallback(
    async (values: UpdateGradeSchoolSubjectsRequest) => {
      const api = initializeApi(session);

      const { grade_id, id, ...data } = values;

      const { data: responseData } = await api.put<GradeSchoolSubject>(
        `/education/admin/grades/${grade_id}/school-subjects/${id}`,
        data
      );

      return responseData;
    },
    [session]
  );

  return useMutation('update-grade-school-subject', updateGradeSchoolSubject, {
    onMutate: () => modalRef.current?.closeModal(),
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações`,
    renderSuccess: () => `Alterações registradas com sucesso.`
  });
}

export function useDeleteGradeSchoolSubject() {
  const [session] = useSession();

  const deleteGradeSchoolSubject = useCallback(
    async (gradeSchoolSubject: GradeSchoolSubject) => {
      const api = initializeApi(session);

      const { id, grade_id } = gradeSchoolSubject;

      const response = await api.delete(
        `/education/admin/grades/${grade_id}/school-subjects/${id}`
      );

      return response;
    },
    [session]
  );

  return useMutation('delete-grade-school-subject', deleteGradeSchoolSubject, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Removendo...</ToastContent>;
    },
    renderError: () => `Falha ao remover vinculo`,
    renderSuccess: () => `Vinculo removido com sucesso.`
  });
}
