import format from 'date-fns/format';
import differenceInYears from 'date-fns/differenceInYears';

import { Enrollment } from 'grpc/generated/report_pb';
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

export const grpcEnrollmentMapper = (
  enrollClassroom: EnrollClassroom
): Enrollment => {
  const enrollment = new Enrollment();

  enrollment.setStudentName(enrollClassroom.enroll.student.name);
  enrollment.setEnrollDate(formatDate(enrollClassroom.enroll.enroll_date));
  enrollment.setGender(enrollClassroom.enroll.student.gender || '-');
  enrollment.setOrigin(enrollClassroom.enroll.origin === 'NEW' ? 'Nov' : 'Rep');
  enrollment.setBreed(enrollClassroom.enroll.student.breed);
  enrollment.setBirthDate(
    formatDate(enrollClassroom.enroll.student.birth_date)
  );
  enrollment.setAge(`${getAge(enrollClassroom.enroll.student.birth_date)}`);
  enrollment.setTransferDate(formatDate(enrollClassroom.enroll.transfer_date));

  return enrollment;
};
