import { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import CalendarMonth from 'components/CalendarMonth';

import { useShowSchoolYear } from 'requests/queries/school-year';
import { useListCalendarEvents } from 'requests/queries/calendar-events';

import { calendarEventMapper } from 'utils/mappers/calendarEventsMapper';

import * as S from './styles';

const CalendarTemplate = () => {
  const { data: session } = useSession();

  const { data: schoolYear } = useShowSchoolYear(session, {
    id: session?.configs.school_year_id
  });
  const { data: calendarEvents } = useListCalendarEvents(
    session,
    {
      school_year_id: schoolYear?.id,
      competence: session?.schoolId ? 'ALL' : 'MUNICIPAL',
      school_id: session?.schoolId
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
            year={2022}
            key={String(month)}
            calendarEvents={mappedCalendarEvents}
          />
        ))}
      </S.CalendarWrapper>
    </Base>
  );
};

export default CalendarTemplate;
