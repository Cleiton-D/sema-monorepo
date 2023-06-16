import { RefObject, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ToastContent from 'components/ToastContent';
import { ModalRef } from 'components/Modal';

import { createUnstableApi, useMutation } from 'services/api';

import { SchoolSubject, SchoolSubjectForm } from 'models/SchoolSubject';

export function useAddSchoolSubjectMutation(modalRef: RefObject<ModalRef>) {
  const addSchoolSubject = useCallback(async (values: SchoolSubjectForm) => {
    const api = createUnstableApi();

    const { id, ...resquestData } = values;

    return id
      ? api.put(`/education/admin/school-subjects/${id}`, resquestData)
      : api.post('/education/admin/school-subjects', resquestData);
  }, []);

  return useMutation('add-school-subjects', addSchoolSubject, {
    linkedQueries: {
      'get-school-subjects': (old, newSchoolSubject) => [
        ...old,
        { ...newSchoolSubject, id: uuidv4(), disabled: true }
      ]
    },
    onMutate: () => modalRef.current?.closeModal(),
    renderLoading: function render(newSchoolSubject) {
      return (
        <ToastContent showSpinner>
          Salvando disciplina {newSchoolSubject.description}
        </ToastContent>
      );
    },
    renderError: () => `Falha ao registrar alterações`,
    renderSuccess: () => `Alterações registradas com sucesso`
  });
}

export function useDeleteSchoolSubjectMutation() {
  const deleteSchoolSubject = useCallback(async (schoolSubject: any) => {
    const api = createUnstableApi();

    return api.delete(`/education/admin/school-subjects/${schoolSubject.id}`);
  }, []);

  return useMutation('delete-school-subject', deleteSchoolSubject, {
    linkedQueries: {
      'get-school-subjects': (
        old: SchoolSubject[],
        deleteSchoolSubject: SchoolSubject
      ) =>
        old.map((schoolSubject) =>
          schoolSubject.id === deleteSchoolSubject.id
            ? { ...schoolSubject, disabled: true }
            : schoolSubject
        )
    },
    renderLoading: function render(deleteSchoolSubject) {
      return (
        <ToastContent showSpinner>
          Removendo {deleteSchoolSubject.description}...
        </ToastContent>
      );
    },
    renderError: (deleteSchoolSubject) =>
      `Falha ao remover ${deleteSchoolSubject.description}`,
    renderSuccess: (deleteSchoolSubject) =>
      `${deleteSchoolSubject.description} removido com sucesso`
  });
}
