import { useMemo } from 'react';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';

import { GroupedCalendarEvents } from 'models/CalendarEvent';

import CalendarDay from 'components/CalendarDay';

type CalendarWeekProps = {
  weekInterval: [Date, Date];
  calendarEvents: GroupedCalendarEvents;
};

const WEEK_MAP = new Map<number, Date | undefined>([
  [0, undefined],
  [1, undefined],
  [2, undefined],
  [3, undefined],
  [4, undefined],
  [5, undefined],
  [6, undefined]
]);

const CalendarWeek = ({ weekInterval, calendarEvents }: CalendarWeekProps) => {
  const days = useMemo(() => {
    const [first, last] = weekInterval;

    const eachDays = eachDayOfInterval({ start: first, end: last });
    const newMap = new Map(WEEK_MAP);
    eachDays.forEach((day) => {
      newMap.set(day.getDay(), day);
    });

    return newMap;
  }, [weekInterval]);

  return (
    <tr>
      {Array.from({ length: 7 }).map((_, idx) => (
        <CalendarDay
          key={String(idx)}
          date={days.get(idx)}
          calendarEvents={calendarEvents}
        />
      ))}
    </tr>
  );
};

export default CalendarWeek;
