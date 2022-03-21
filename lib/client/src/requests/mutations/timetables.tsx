import { useCallback } from 'react';
import { useSession } from 'next-auth/react';

import { DayOfWeek } from 'models/DafOfWeek';

import { initializeApi, useMutation } from 'services/api';
import { Timetable } from 'models/Timetable';
import ToastContent from 'components/ToastContent';

type TimetableToUpdate = {
  id?: string;
  school_subject_id?: string;
  employee_id?: string;
  day_of_week: DayOfWeek;
  time_start: string;
  time_end: string;
};

type UpdateTimetablesRequest = {
  school_id: string;
  classroom_id: string;
  timetables: TimetableToUpdate[];
};

export function useUpdateTimetables() {
  const { data: session } = useSession();

  const updateTimetables = useCallback(
    async (values: UpdateTimetablesRequest) => {
      const api = initializeApi(session);

      const { data: responseData } = await api.put<Timetable[]>(
        `/timetables`,
        values
      );

      return responseData;
    },
    [session]
  );

  return useMutation('update-timetables', updateTimetables, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações`,
    renderSuccess: () => `Alterações registradas com sucesso.`
  });
}
