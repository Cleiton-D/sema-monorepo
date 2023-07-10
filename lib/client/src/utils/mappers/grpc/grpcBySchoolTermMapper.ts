import format from 'date-fns/format';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

import {
  SchoolTermItems as GrpcSchoolTermItems,
  MinifiedAttendance as MinifiedAttendanceGrpc,
  Class as GrpcClass
} from 'grpc/generated/report_pb';

import {
  AttendanceCount,
  MinifiedAttendance as MinifiedAttendanceModel
} from 'models/Attendance';
import { FormattedClass, MinifiedClass } from 'models/Class';
import { EnrollClassroom } from 'models/EnrollClassroom';
import { SchoolReport } from 'models/SchoolReport';
import { SchoolTerm } from 'models/SchoolTerm';
import { SchoolTermPeriod } from 'models/SchoolTermPeriod';

import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

import {
  orderSchoolTerm,
  shortTranslateSchoolTerm
} from '../schoolTermPeriodMapper';
import { grpcMinifiedAttendancesMapper } from './grpcMinifiedAttendancesMapper';
import { grpcSchoolReportsBySchoolTermMapper } from './grpcSchoolReportsBySchoolTermMapper';

type Params = {
  classes: FormattedClass[];
  attendances: MinifiedAttendanceModel[];
  attendancesCount: AttendanceCount[];
  minifiedClasses: MinifiedClass[];
  enrollClassrooms: EnrollClassroom[];
  schoolTermPeriods: SchoolTermPeriod[];
  schoolReports: SchoolReport[];
};

const formatDate = (date?: Date | string) => {
  if (!date) return '';
  if (date instanceof Date) {
    return format(date, 'dd/MM');
  }

  return format(parseDateWithoutTimezone(date), 'dd/MM');
};

export const grpcBySchoolTermMapper = ({
  enrollClassrooms,
  classes,
  attendances,
  minifiedClasses,
  schoolTermPeriods,
  schoolReports,
  attendancesCount
}: Params): any[] => {
  const groupedEnrolls = enrollClassrooms.reduce<
    Record<string, EnrollClassroom>
  >((acc, enrollClassroom) => {
    return { ...acc, [enrollClassroom.id]: enrollClassroom };
  }, {});

  const groupedMinifiedClasses = minifiedClasses.reduce<
    Record<string, MinifiedClass>
  >((acc, classEntity) => {
    return { ...acc, [classEntity.id]: classEntity };
  }, {});

  const groupedAttendancesByClass = attendances.reduce<
    Record<string, MinifiedAttendanceModel[]>
  >((acc, attendance) => {
    const current = acc[attendance.class_id] || [];
    return { ...acc, [attendance.class_id]: [...current, attendance] };
  }, {});

  const groupedClassesBySchoolTerm = classes.reduce<
    PartialRecord<SchoolTerm, FormattedClass[]>
  >((acc, classEntity) => {
    const current = acc[classEntity.school_term] || [];

    return {
      ...acc,
      [classEntity.school_term]: [...current, classEntity]
    };
  }, {});

  const grpcSchoolReportsBySchoolTerm = grpcSchoolReportsBySchoolTermMapper({
    schoolReports,
    attendancesCount
  });

  return schoolTermPeriods
    .sort((a, b) => orderSchoolTerm(a.school_term, b.school_term))
    .map((schoolTermPeriod) => {
      const classes =
        groupedClassesBySchoolTerm[schoolTermPeriod.school_term] || [];

      const attendances = classes.reduce<any[]>((acc, classEntity) => {
        const classAttendances =
          groupedAttendancesByClass[classEntity.id] || [];
        const minifiedClass = groupedMinifiedClasses[classEntity.id];

        const grpcAttendances = classAttendances.map((attendance) => {
          const enrollClassroom =
            groupedEnrolls[attendance.enroll_classroom_id];

          return {
            student_name: enrollClassroom.enroll.student.name,
            class_date: parseDateWithoutTimezone(minifiedClass.class_date),
            attendance: attendance.attendance
          };
        });
        return [...acc, ...grpcAttendances];
      }, []);
      const classList = classes.map((classEntity) => {
        return {
          class_date: formatDate(classEntity.class_date),
          taught_content: classEntity.taught_content
        };
      });

      return {
        schoolTerm: schoolTermPeriod.school_term,
        schoolTermEnd: parseDateWithoutTimezone(schoolTermPeriod.date_end),
        attendances: attendances,
        classes: classList,
        schoolReports:
          grpcSchoolReportsBySchoolTerm[schoolTermPeriod.school_term]
      };
    });
};
