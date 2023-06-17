import { useCallback } from 'react';

import ToastContent from 'components/ToastContent';
import { ModalRef } from 'components/Modal';

import {
  CreateGradeSchoolSubjectsRequest,
  GradeSchoolSubject,
  UpdateGradeSchoolSubjectsRequest
} from 'models/GradeSchoolSubject';

import { createUnstableApi, useMutation } from 'services/api';

export function useMutateGradeSchoolSubject(
  modalRef: React.RefObject<ModalRef>
) {
  const mutateGradeSchoolSubject = useCallback(
    async (values: CreateGradeSchoolSubjectsRequest) => {
      const api = createUnstableApi();

      const { grade_id, ...data } = values;

      const { data: responseData } = await api.post<GradeSchoolSubject[]>(
        `/education/admin/grades/${grade_id}/school-subjects`,
        data
      );

      return responseData;
    },
    []
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
  const updateGradeSchoolSubject = useCallback(
    async (values: UpdateGradeSchoolSubjectsRequest) => {
      const api = createUnstableApi();

      const { grade_id, id, ...data } = values;

      const { data: responseData } = await api.put<GradeSchoolSubject>(
        `/education/admin/grades/${grade_id}/school-subjects/${id}`,
        data
      );

      return responseData;
    },
    []
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
  const deleteGradeSchoolSubject = useCallback(
    async (gradeSchoolSubject: GradeSchoolSubject) => {
      const api = createUnstableApi();

      const { id, grade_id } = gradeSchoolSubject;

      const response = await api.delete(
        `/education/admin/grades/${grade_id}/school-subjects/${id}`
      );

      return response;
    },
    []
  );

  return useMutation('delete-grade-school-subject', deleteGradeSchoolSubject, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Removendo...</ToastContent>;
    },
    renderError: () => `Falha ao remover vinculo`,
    renderSuccess: () => `Vinculo removido com sucesso.`
  });
}
