import format from 'date-fns/format';

import { Class, FormattedClass } from 'models/Class';
import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

export const classMapper = (classEntity: Class): FormattedClass => {
  const translatedStatus = {
    PROGRESS: 'Andamento',
    DONE: 'Finalizado'
  }[classEntity.status];

  return {
    ...classEntity,
    translatedStatus,
    formattedClassDate: format(
      parseDateWithoutTimezone(classEntity.class_date),
      'dd/MM/yyyy'
    )
    // formattedTimeStart: masks.time(classEntity.time_start),
    // formattedTimeEnd: classEntity.time_end && masks.time(classEntity.time_end)
  };
};
