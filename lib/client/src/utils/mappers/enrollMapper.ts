import format from 'date-fns/format';
import differenceInYears from 'date-fns/differenceInYears';

import { Enroll, EnrollStatus, MappedEnroll } from 'models/Enroll';
import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

export const genderMap = {
  male: 'Masculino',
  female: 'Feminino'
};

export const statusMap: Record<EnrollStatus | string, string> = {
  ACTIVE: 'Cursando',
  INACTIVE: 'Inativo',
  TRANSFERRED: 'Transferido',
  QUITTER: 'Desistente',
  DECEASED: 'Falecido',
  APPROVED: 'Aprovado',
  DISAPPROVED: 'Reprovado',
  RELOCATED: 'Remanejado',
  DISAPPROVED_FOR_ABSENCES: 'Reprovado',
  EXAM: 'Exame',
  RECOVERY: 'Recuperação'
};

export const enrollMapper = (enroll: Enroll): MappedEnroll => {
  const birthDateStr = enroll.student.birth_date as unknown as string;

  const parsedBirthDate = birthDateStr
    ? parseDateWithoutTimezone(birthDateStr)
    : undefined;

  const birthDate = parsedBirthDate
    ? format(parsedBirthDate, 'dd/MM/yyyy')
    : undefined;

  const studentAge = parsedBirthDate
    ? differenceInYears(new Date(), parsedBirthDate)
    : undefined;

  const enrollDate = enroll.enroll_date as string | Date;

  const enrollDateStr =
    enrollDate instanceof Date ? enrollDate.toISOString() : String(enrollDate);

  const [year, month, day] = enrollDateStr.split('T')[0].split('-');
  const newEnrollDate = `${day}/${month}/${year}`;

  return {
    ...enroll,
    formattedBirthDate: birthDate,
    formattedGender: enroll.student.gender && genderMap[enroll.student.gender],
    formattedStatus: enroll.status && statusMap[enroll.status],
    studentAge: studentAge,
    formattedCreatedAt: format(
      parseDateWithoutTimezone(enroll.created_at),
      'dd/MM/yyyy'
    ),
    formattedEnrollDate: newEnrollDate
  };
};

export const translateEnrollStatus = (status: EnrollStatus | string) => {
  return statusMap[status];
};
