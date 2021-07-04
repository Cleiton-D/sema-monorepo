import { ClassPeriod, FormattedClassPeriod } from 'models/ClassPeriod';
import { masks } from 'utils/masks';

export const translateDescription = (description: string) =>
  ({
    MORNING: 'Matutino',
    EVENING: 'Vespertino',
    NOCTURNAL: 'Noturno'
  }[description] || description);

export const classPeriodsMapper = (
  classPeriod: ClassPeriod
): FormattedClassPeriod => ({
  ...classPeriod,
  translated_description: translateDescription(classPeriod.description),
  time_start: masks.time(classPeriod.time_start),
  time_end: masks.time(classPeriod.time_end),
  class_time: masks.time(classPeriod.class_time),
  break_time: masks.time(classPeriod.break_time),
  break_time_start: masks.time(classPeriod.break_time_start)
});
