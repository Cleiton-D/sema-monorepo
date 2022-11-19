import { useCallback } from 'react';
import { useSession } from 'next-auth/react';

import {
  CalendarEvent,
  CalendarEventCompetence,
  CalendarEventType
} from 'models/CalendarEvent';

import { initializeApi, useMutation } from 'services/api';
import ToastContent from 'components/ToastContent';

export type CreateCalendarEventRequestData = {
  school_year_id: string;
  date: Date | string;
  description: string;
  type: CalendarEventType;
  competence: CalendarEventCompetence;
  school_id?: string;
};

export function useCreateCalendarEvent() {
  const { data: session } = useSession();

  const createCalendarEvent = useCallback(
    async (values: CreateCalendarEventRequestData) => {
      const api = initializeApi(session);

      const { data: responseData } = await api.post<CalendarEvent>(
        '/calendar-events',
        values
      );

      return responseData;
    },
    [session]
  );

  return useMutation('create-calendar-event', createCalendarEvent, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao registar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}

export function useDeleteCalendarEvent() {
  const { data: session } = useSession();

  const deleteCalendarEvent = useCallback(
    async (calendarEvent: CalendarEvent) => {
      const api = initializeApi(session);

      const { data: responseData } = await api.delete(
        `/calendar-events/${calendarEvent.id}`
      );

      return responseData;
    },
    [session]
  );

  return useMutation('delete-calendar-event', deleteCalendarEvent, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao registar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}
