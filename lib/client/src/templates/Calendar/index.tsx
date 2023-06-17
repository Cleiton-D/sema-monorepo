import { useMemo } from 'react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import CalendarMonth from 'components/CalendarMonth';

import { useListCalendarEvents } from 'requests/queries/calendar-events';
import { useProfile, useSessionSchoolYear } from 'requests/queries/session';

import { calendarEventMapper } from 'utils/mappers/calendarEventsMapper';

import * as S from './styles';

const CalendarTemplate = () => {
  const { data: schoolYear } = useSessionSchoolYear();
  const { data: profile } = useProfile();

  const { data: calendarEvents } = useListCalendarEvents(
    {
      school_year_id: schoolYear?.id,
      competence: profile?.school?.id ? 'ALL' : 'MUNICIPAL',
      school_id: profile?.school?.id
    },
    {
      enabled: !!schoolYear?.id
    }
  );

  const mappedCalendarEvents = useMemo(() => {
    if (!calendarEvents?.length) return {};

    return calendarEventMapper(calendarEvents);
  }, [calendarEvents]);

  return (
    <Base>
      <Heading>Calendário escolar</Heading>
      <S.LightText>Ano Referência: {schoolYear?.reference_year}</S.LightText>

      <S.CalendarWrapper>
        {Array.from({ length: 12 }).map((_, month) => (
          <CalendarMonth
            month={month}
            year={
              schoolYear?.reference_year ? +schoolYear.reference_year : 2022
            }
            key={String(month)}
            calendarEvents={mappedCalendarEvents}
          />
        ))}
      </S.CalendarWrapper>
    </Base>
  );
};

export default CalendarTemplate;
