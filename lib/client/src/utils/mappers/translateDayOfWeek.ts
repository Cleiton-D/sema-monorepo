import { DayOfWeek } from 'models/DafOfWeek';

const days = {
  SUNDAY: 'Domingo',
  MONDAY: 'Segunda',
  TUESDAY: 'Terça',
  WEDNESDAY: 'Quarta',
  THURSDAY: 'Quinta',
  FRIDAY: 'Sexta',
  SATURDAY: 'Sábado'
};

export const translateDayOfWeek = (dayOfWeek: DayOfWeek): string => {
  return days[dayOfWeek];
};
