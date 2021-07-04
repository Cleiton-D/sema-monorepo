import { RefObject, useCallback } from 'react';
import { useSession } from 'next-auth/client';
import { useAtomValue } from 'jotai/utils';
import { v4 as uuidv4 } from 'uuid';

import { schoolYearAtom } from 'store/atoms/school-year';

import { initializeApi, useApi, useMutation } from 'services/api';
import { queryKeys } from 'requests/queries/class-periods';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import {
  FormattedClassPeriod,
  ClassPeriodForm,
  ClassPeriod
} from 'models/ClassPeriod';

import { ModalRef } from 'components/Modal';
import ToastContent from 'components/ToastContent';

const oldToNewClassPeriods = (
  old: FormattedClassPeriod[],
  newClassPeriod: ClassPeriodForm
) => {
  if (!old) return old;

  const existentIndex = old.findIndex(
    ({ description }) => description === newClassPeriod.description
  );

  if (existentIndex !== -1) {
    const existentItem = old[existentIndex];
    const newItem = {
      ...existentItem,
      ...newClassPeriod,
      translated_description: translateDescription(newClassPeriod.description),
      disabled: true
    } as FormattedClassPeriod;

    old.splice(existentIndex, 1, newItem);
    return old;
  }

  return [
    ...old,
    {
      ...newClassPeriod,
      translated_description: translateDescription(newClassPeriod.description),
      id: uuidv4(),
      disabled: true
    }
  ];
};

export function useMutateClassPeriod(modalRef: RefObject<ModalRef>) {
  const [session] = useSession();
  const createSchoolYearState = useAtomValue(schoolYearAtom);

  const mutateClassPeriod = useCallback(
    async (values: ClassPeriodForm) => {
      const api = initializeApi(session);

      const { description, ...newValues } = values;
      const data = {
        school_year_id: createSchoolYearState?.schoolYear.id,
        periods: { [description]: newValues }
      };

      const { data: responseData } = await api.post<ClassPeriod[]>(
        '/education/admin/class-periods',
        data
      );

      return responseData;
    },
    [createSchoolYearState, session]
  );

  return useMutation('create-class-period', mutateClassPeriod, {
    linkedQueries: {
      [queryKeys.LIST_CLASS_PERIODS]: oldToNewClassPeriods
    },
    onMutate: () => modalRef.current?.closeModal(),
    renderLoading: function render(newClassPeriod) {
      return (
        <ToastContent showSpinner>
          Salvando período {translateDescription(newClassPeriod.description)}...
        </ToastContent>
      );
    },
    renderError: (newClassPeriod) =>
      `Falha ao salvar período ${translateDescription(
        newClassPeriod.description
      )}`,
    renderSuccess: (newClassPeriod) =>
      `Período ${translateDescription(
        newClassPeriod.description
      )} cadastrado com sucesso`
  });
}

export function useDeleteClassPeriod() {
  const [session] = useSession();
  const api = useApi(session);

  const deleteClassPeriod = useCallback(
    async (classPeriod: FormattedClassPeriod) => {
      const { id } = classPeriod;
      await api.delete(`/education/admin/class-periods/${id}`);
    },
    [api]
  );

  return useMutation('delete-class-period', deleteClassPeriod, {
    linkedQueries: {
      [queryKeys.LIST_CLASS_PERIODS]: (
        old: FormattedClassPeriod[],
        removed: FormattedClassPeriod
      ) => {
        if (!old) return;
        return old.map((item) =>
          item.id === removed.id ? { ...item, disabled: true } : item
        );
      }
    },
    renderLoading: function render(newClassPeriod) {
      return (
        <ToastContent showSpinner>
          Removendo período {translateDescription(newClassPeriod.description)}
          ...
        </ToastContent>
      );
    },
    renderError: (newClassPeriod) =>
      `Falha ao remover período ${translateDescription(
        newClassPeriod.description
      )}`,
    renderSuccess: (newClassPeriod) =>
      `Período ${translateDescription(
        newClassPeriod.description
      )} removido com sucesso`
  });
}
