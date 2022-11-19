import { useMemo } from 'react';
import format from 'date-fns/format';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import eachWeekOfInterval from 'date-fns/eachWeekOfInterval';
import lastDayOfWeek from 'date-fns/lastDayOfWeek';
import isBefore from 'date-fns/isBefore';
import ptBr from 'date-fns/locale/pt-BR';

import CalendarWeek from 'components/CalendaWeek';

import { GroupedCalendarEvents } from 'models/CalendarEvent';

import * as S from './styles';

type CalendarMonthProps = {
  month: number;
  year: number;
  calendarEvents: GroupedCalendarEvents;
};

const CalendarMonth = ({ month, year, calendarEvents }: CalendarMonthProps) => {
  const monthName = useMemo(() => {
    const currentDate = new Date(year, month, 1);

    return format(currentDate, 'MMMM', { locale: ptBr });
  }, [month, year]);

  const rows = useMemo(() => {
    const startDate = new Date(year, month, 1);
    const endDate = lastDayOfMonth(startDate);

    const eachWeeks = eachWeekOfInterval({
      start: startDate,
      end: endDate
    });

    return eachWeeks.reduce<Array<[Date, Date]>>((acc, item) => {
      const lastDayOfThisWeek = lastDayOfWeek(item);

      const firstDay = isBefore(item, startDate) ? startDate : item;
      const lastDay = isBefore(lastDayOfThisWeek, endDate)
        ? lastDayOfThisWeek
        : endDate;

      return [...acc, [firstDay, lastDay]];
    }, []);
  }, [year, month]);

  return (
    <S.Wrapper>
      <S.Title>{monthName}</S.Title>
      <S.Table>
        <thead>
          <tr>
            <th>Dom</th>
            <th>Seg</th>
            <th>Ter</th>
            <th>Qua</th>
            <th>Qui</th>
            <th>Sex</th>
            <th>Sáb</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <CalendarWeek
              key={String(index)}
              weekInterval={row}
              calendarEvents={calendarEvents}
            />
          ))}
        </tbody>
      </S.Table>
    </S.Wrapper>
  );
};

export default CalendarMonth;
