import { addMinutes, isBefore, isAfter, isEqual, format } from 'date-fns';

type ClassPeriodTimes = {
  time_start: string;
  time_end: string;
  class_time: string;
  break_time: string;
  break_time_start: string;
};

const parseTime = (time: string) => {
  const [hour, minute] = time.split(':');

  const currentDate = new Date();
  currentDate.setHours(+hour, +minute);
  return currentDate;
};

const getMinutes = (time: string) => {
  const [hour, minutes] = time.split(':');
  const numberHour = +hour;
  const numberMinutes = +minutes;

  const hourInMinutes = numberHour * 60;
  return hourInMinutes + numberMinutes;
};

type TimetableItem = {
  timeStart: string;
  timeEnd: string;
};

export const generateTimetable = ({
  time_start,
  time_end,
  class_time,
  break_time,
  break_time_start
}: ClassPeriodTimes): TimetableItem[] => {
  const parsedTimeStart = parseTime(time_start);
  const parsedTimeEnd = parseTime(time_end);
  const parsedBreakTimeStart = parseTime(break_time_start);
  const classTimeMinutes = getMinutes(class_time);
  const breakTimeMinutes = getMinutes(break_time);

  const breakTimeEnd = addMinutes(parsedBreakTimeStart, breakTimeMinutes);

  const isEqualBreak = isEqual(parsedTimeStart, parsedBreakTimeStart);
  const isBeforeBreak = isBefore(parsedTimeStart, parsedBreakTimeStart);
  const isAfterBreak = isAfter(parsedTimeStart, breakTimeEnd);
  const isBetweenBreak = isEqualBreak || (!isBeforeBreak && !isAfterBreak);

  const classTimeStart = isBetweenBreak ? breakTimeEnd : parsedTimeStart;
  const classTimeEnd = addMinutes(classTimeStart, classTimeMinutes);

  const startBeforeBreak = isBefore(classTimeStart, parsedBreakTimeStart);
  const endBeforeBreak = isBefore(classTimeEnd, parsedBreakTimeStart);
  const classBeforeBreak = startBeforeBreak && endBeforeBreak;

  const startEqualBreakEnd = isEqual(classTimeStart, breakTimeEnd);
  const startAfterBreak = isAfter(classTimeStart, parsedBreakTimeStart);
  const endAfterBreak = isAfter(classTimeEnd, parsedBreakTimeStart);
  const classAfterBreak =
    (startAfterBreak || startEqualBreakEnd) && endAfterBreak;

  const withBreakTimeEnd =
    classBeforeBreak || classAfterBreak ? classTimeEnd : parsedBreakTimeStart;

  const startBeforeEnd = isBefore(classTimeStart, parsedTimeEnd);
  if (!startBeforeEnd) return [];

  const endBeforeEnd = isBefore(withBreakTimeEnd, parsedTimeEnd);
  const finalClassTimeEnd = endBeforeEnd ? withBreakTimeEnd : parsedTimeEnd;

  const startStr = format(classTimeStart, 'HH:mm');
  const endStr = format(finalClassTimeEnd, 'HH:mm');

  const finalItem = {
    timeStart: startStr,
    timeEnd: endStr
  };

  const nextItems = generateTimetable({
    time_start: endStr,
    time_end,
    class_time,
    break_time,
    break_time_start
  });

  return [finalItem, ...nextItems];
};
