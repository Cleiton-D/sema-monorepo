import { parseISO, format } from 'date-fns';

import { Class, FormattedClass } from 'models/Class';
import { masks } from 'utils/masks';

export const classMapper = (classEntity: Class): FormattedClass => {
  const translatedStatus = {
    PROGRESS: 'Andamento',
    DONE: 'Finalizado'
  }[classEntity.status];

  return {
    ...classEntity,
    translatedStatus,
    formattedClassDate: format(parseISO(classEntity.class_date), 'dd/MM/yyyy'),
    formattedTimeStart: masks.time(classEntity.time_start),
    formattedTimeEnd: classEntity.time_end && masks.time(classEntity.time_end)
  };
};
