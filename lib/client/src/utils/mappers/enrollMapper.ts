import { parseISO, format, differenceInYears } from 'date-fns';

import { Enroll, EnrollStatus, MappedEnroll } from 'models/Enroll';

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
  RELOCATED: 'Remanejado'
};

export const enrollMapper = (enroll: Enroll): MappedEnroll => {
  const birthDateStr = enroll.student.birth_date as unknown as string;

  const parsedBirthDate = birthDateStr ? parseISO(birthDateStr) : undefined;

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
    formattedCreatedAt: format(parseISO(enroll.created_at), 'dd/MM/yyyy'),
    formattedEnrollDate: newEnrollDate
  };
};

export const translateEnrollStatus = (status: EnrollStatus | string) => {
  return statusMap[status];
};
