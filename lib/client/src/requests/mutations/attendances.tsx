import { useCallback } from 'react';

import ToastContent from 'components/ToastContent';

import { Attendance } from 'models/Attendance';

import { createUnstableApi, useMutation } from 'services/api';

type RegisterAttendancesFormData = {
  class_id: string;
  attendances: Array<{
    enroll_id: string;
    attendance: boolean;
  }>;
};

export function useRegisterAttendances() {
  const registerAttendances = useCallback(
    async (values: RegisterAttendancesFormData) => {
      const api = createUnstableApi();

      const { data: responseData } = await api.put<Attendance[]>(
        `/attendances`,
        values
      );

      return responseData;
    },
    []
  );

  return useMutation('register-attendances', registerAttendances, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}

type JustifyAbsenceFormData = {
  attendance_id: string;
  description: string;
};

export function useJustifyAbsence() {
  const justifyAbsence = useCallback(async (values: JustifyAbsenceFormData) => {
    const api = createUnstableApi();

    const { attendance_id, ...params } = values;

    const { data: responseData } = await api.patch<Attendance>(
      `/attendances/${attendance_id}/justify`,
      params
    );

    return responseData;
  }, []);

  return useMutation('justify-absence', justifyAbsence, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}

type RemoveAbsenceJustificationData = {
  attendance_id: string;
  description: string;
};

export function useRemoveAbsenceJustification() {
  const removeAbsenceJustification = useCallback(
    async (values: RemoveAbsenceJustificationData) => {
      const api = createUnstableApi();

      const { attendance_id } = values;

      const { data: responseData } = await api.delete<Attendance>(
        `/attendances/${attendance_id}/justify`
      );

      return responseData;
    },
    []
  );

  return useMutation(
    'remove-absence-justification',
    removeAbsenceJustification,
    {
      renderLoading: function render() {
        return <ToastContent showSpinner>Salvando...</ToastContent>;
      },
      renderError: () => `Falha ao salvar alterações.`,
      renderSuccess: () => `Alterações realizadas com sucesso.`
    }
  );
}
