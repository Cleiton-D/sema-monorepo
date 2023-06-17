import { useMemo, useRef } from 'react';
import { useQueryClient } from 'react-query';
import format from 'date-fns/format';
import ptBr from 'date-fns/locale/pt-BR';

import { GroupedCalendarEvents } from 'models/CalendarEvent';

import CreateCalendarEventModal, {
  CreateCalendarEventModalRef
} from 'components/CreateCalendarEventModal';

import { calendarEventsKeys } from 'requests/queries/calendar-events';
import { useDeleteCalendarEvent } from 'requests/mutations/calendar-event';

import * as S from './styles';
import { useAccess } from 'hooks/AccessProvider';
import { useProfile } from 'requests/queries/session';

type CalendarDayProps = {
  date?: Date;
  calendarEvents: GroupedCalendarEvents;
};

const CURRENT_DATE = new Date();
CURRENT_DATE.setHours(23, 59, 59, 99);

const CalendarDay = ({ date, calendarEvents }: CalendarDayProps) => {
  const modalRef = useRef<CreateCalendarEventModalRef>(null);

  const queryClient = useQueryClient();

  const { data: profile } = useProfile();
  const { enableAccess } = useAccess();

  const deleteCalendarEvent = useDeleteCalendarEvent();

  const calendarEvent = useMemo(() => {
    if (!date) return undefined;

    const formated = format(date, 'yyyy-MM-dd');
    return calendarEvents[formated];
  }, [date, calendarEvents]);

  const canEditCalendarEvents = useMemo(() => {
    return enableAccess({ module: 'CALENDAR', rule: 'WRITE' });
  }, [enableAccess]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!canEditCalendarEvents) return;
    if (!date) return;

    if (!calendarEvent) {
      modalRef.current?.openModal(date);
      return;
    }

    if (profile?.branch?.type === 'SCHOOL') {
      if (calendarEvent.school_id !== profile.school?.id) return;
    }
    if (profile?.branch?.type === 'MUNICIPAL_SECRETARY') {
      if (calendarEvent.school_id) return;
    }

    let type = '';
    if (calendarEvent.type === 'HOLIDAY') type = 'feriado';
    if (calendarEvent.type === 'SCHOOL_WEEKEND') {
      type = format(date, "EEEE 'letivo'", { locale: ptBr });
    }

    const confirmation = window.confirm(`Deseja remover este ${type}?`);
    if (confirmation) {
      await deleteCalendarEvent.mutateAsync(calendarEvent);
      queryClient.invalidateQueries(calendarEventsKeys.lists());
    }
  };

  const dayText = date && format(date, 'dd');
  // const isDisabled = date && isBefore(date, CURRENT_DATE);

  return (
    <>
      <S.Wrapper
        isEmpty={!date}
        // disabled={isDisabled}
        isHoliday={calendarEvent?.type === 'HOLIDAY'}
        isSchoolWeekend={calendarEvent?.type === 'SCHOOL_WEEKEND'}
        isWeekend={date && [0, 6].includes(date?.getDay())}
        message={calendarEvent?.description}
      >
        {dayText && (
          <S.DayButton disabled={!canEditCalendarEvents} onClick={handleClick}>
            {dayText}
          </S.DayButton>
        )}
        <CreateCalendarEventModal ref={modalRef} />
      </S.Wrapper>
    </>
  );
};

export default CalendarDay;
