import { ClassPeriod } from 'models/ClassPeriod';

export const translateDescription = (description: ClassPeriod) =>
  ({
    MORNING: 'Matutino',
    EVENING: 'Vespertino',
    NOCTURNAL: 'Noturno'
  }[description] || description);
