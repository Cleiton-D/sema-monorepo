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
  originalClassPeriod: classPeriod,
  translated_description: translateDescription(classPeriod.description),
  time_start: masks.time(classPeriod.time_start) || '-',
  time_end: masks.time(classPeriod.time_end) || '-',
  class_time: masks.time(classPeriod.class_time) || '-',
  break_time: masks.time(classPeriod.break_time),
  break_time_start: masks.time(classPeriod.break_time_start)
});

const order: Record<string, number> = {
  Matutino: 1,
  Vespertino: 2,
  Noturno: 3
};

export const orderClassPeriod = (a: ClassPeriod, b: ClassPeriod) => {
  const indexA = order[a.description];
  const indexB = order[b.description];

  if (!indexA || !indexB) {
    return a.description.localeCompare(b.description);
  }

  return indexA - indexB;
};

export const orderClassPeriods = (
  classPeriods: ClassPeriod[]
): ClassPeriod[] => {
  return classPeriods.sort(orderClassPeriod);
};
