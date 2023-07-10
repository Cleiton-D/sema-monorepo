import format from 'date-fns/format';
import differenceInYears from 'date-fns/differenceInYears';

import { EnrollClassroom } from 'models/EnrollClassroom';

import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

const formatDate = (date?: Date | string) => {
  if (!date) return '';
  if (date instanceof Date) {
    return format(date, 'dd/MM/yyyy');
  }

  return format(parseDateWithoutTimezone(date), 'dd/MM/yyyy');
};

const getAge = (date?: Date | string) => {
  if (!date) return '';
  if (date instanceof Date) {
    return differenceInYears(new Date(), date);
  }

  return differenceInYears(new Date(), parseDateWithoutTimezone(date));
};

export const grpcEnrollmentMapper = (enrollClassroom: EnrollClassroom): any => {
  return {
    student_name: enrollClassroom.enroll.student.name,
    enroll_date: formatDate(enrollClassroom.enroll.enroll_date),
    gender: enrollClassroom.enroll.student.gender || '-',
    origin: enrollClassroom.enroll.origin === 'NEW' ? 'Nov' : 'Rep',
    breed: enrollClassroom.enroll.student.breed,
    birth_date: formatDate(enrollClassroom.enroll.student.birth_date),
    age: `${getAge(enrollClassroom.enroll.student.birth_date)}`,
    transfer_date: formatDate(enrollClassroom.enroll.transfer_date)
  };
};
