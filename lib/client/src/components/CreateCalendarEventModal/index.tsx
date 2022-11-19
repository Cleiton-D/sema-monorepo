import {
  useCallback,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef
} from 'react';
import { useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';
import { FormHandles } from '@unform/core';
import { ValidationError } from 'yup';
import format from 'date-fns/format';
import isWeekend from 'date-fns/isWeekend';
import ptBr from 'date-fns/locale/pt-BR';

import Button from 'components/Button';
import Modal, { ModalRef } from 'components/Modal';
import TextInput from 'components/TextInput';

import { calendarEventsKeys } from 'requests/queries/calendar-events';
import { useCreateCalendarEvent } from 'requests/mutations/calendar-event';

import { calendarEventSchema } from './rules/schema';

import * as S from './styles';

type CreateCalendarEventForm = {
  description: string;
};

export type CreateCalendarEventModalRef = {
  openModal: (date: Date) => void;
};

const CreateCalendarEventModal: React.ForwardRefRenderFunction<
  CreateCalendarEventModalRef
> = (_, ref) => {
  const [date, setDate] = useState<Date>();

  const modalRef = useRef<ModalRef>(null);
  const formRef = useRef<FormHandles>(null);

  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const createCalendarEvent = useCreateCalendarEvent();

  const openModal = useCallback((day: Date) => {
    setDate(day);
    modalRef.current?.openModal();
  }, []);

  const handleBack = useCallback(() => {
    setDate(undefined);
    modalRef.current?.closeModal();
  }, []);

  const handleSubmit = useCallback(
    async (values: CreateCalendarEventForm) => {
      if (!date) return;

      try {
        await calendarEventSchema.validate(values, { abortEarly: false });

        const type = isWeekend(date) ? 'SCHOOL_WEEKEND' : 'HOLIDAY';
        let confirmation = true;
        if (type === 'HOLIDAY') {
          confirmation = window.confirm(
            'Nao será possível registrar aulas para este dia.\nDeseja continuar?'
          );
        }

        if (confirmation) {
          await createCalendarEvent.mutateAsync({
            school_year_id: session?.configs.school_year_id,
            date,
            description: values.description,
            type,
            competence: session?.schoolId ? 'SCHOLL' : 'MUNICIPAL',
            school_id: session?.schoolId
          });

          queryClient.invalidateQueries(calendarEventsKeys.lists());
          handleBack();
        }
      } catch (err) {
        if (err instanceof ValidationError) {
          const validationErrors: Record<string, string> = {};

          err.inner.forEach((error) => {
            if (error.path) {
              validationErrors[error.path] = error.message;
            }
          });
          formRef.current?.setErrors(validationErrors);
        }
      }
    },
    [session, date, createCalendarEvent, queryClient, handleBack]
  );

  const modalTitle =
    date && isWeekend(date)
      ? format(date, "EEEE 'letivo'", { locale: ptBr })
      : `Adicionar feriado`;

  useImperativeHandle(ref, () => ({ openModal }));

  const dateText = date && format(date, '(dd/MM/yyyy)');

  return (
    <Modal
      title={`${modalTitle} ${dateText}`}
      ref={modalRef}
      closeOnClickOutside={false}
    >
      <S.Wrapper>
        <S.Form onSubmit={handleSubmit} ref={formRef}>
          <S.FieldsContainer>
            <TextInput name="description" label="Descrição" />
          </S.FieldsContainer>

          <S.ButtonsContainer>
            <Button
              styleType="outlined"
              onClick={handleBack}
              type="button"
              size="medium"
            >
              Cancelar
            </Button>
            <Button styleType="rounded" type="submit" size="medium">
              Salvar
            </Button>
          </S.ButtonsContainer>
        </S.Form>
      </S.Wrapper>
    </Modal>
  );
};

export default forwardRef(CreateCalendarEventModal);
