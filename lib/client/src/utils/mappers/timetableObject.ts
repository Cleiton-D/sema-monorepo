import { DayOfWeek } from 'models/DafOfWeek';
import { Timetable } from 'models/Timetable';

import { masks } from 'utils/masks';

type Response = Record<string, Record<DayOfWeek, Timetable>>;

export const timetableObject = (timetables: Timetable[]) => {
  const mappedItems = timetables.map((item) => ({
    ...item,
    masktedTimeStart: masks.time(item.time_start),
    masktedTimeEnd: masks.time(item.time_end)
  }));

  const result = mappedItems.reduce<Response>((acc, item) => {
    const key = `${item.masktedTimeStart} - ${item.masktedTimeEnd}`;
    const currentItems = acc[key];
    const newItems = { ...currentItems, [item.day_of_week]: item };

    return { ...acc, [key]: newItems };
  }, {});

  return result;
};
