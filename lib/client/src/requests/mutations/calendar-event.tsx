import { useCallback } from 'react';

import {
  CalendarEvent,
  CalendarEventCompetence,
  CalendarEventType
} from 'models/CalendarEvent';

import { createUnstableApi, useMutation } from 'services/api';
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
  const createCalendarEvent = useCallback(
    async (values: CreateCalendarEventRequestData) => {
      const api = createUnstableApi();

      const { data: responseData } = await api.post<CalendarEvent>(
        '/calendar-events',
        values
      );

      return responseData;
    },
    []
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
  const deleteCalendarEvent = useCallback(
    async (calendarEvent: CalendarEvent) => {
      const api = createUnstableApi();

      const { data: responseData } = await api.delete(
        `/calendar-events/${calendarEvent.id}`
      );

      return responseData;
    },
    []
  );

  return useMutation('delete-calendar-event', deleteCalendarEvent, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao registar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}
