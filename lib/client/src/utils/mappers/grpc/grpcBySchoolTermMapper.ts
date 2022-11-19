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
}: Params): GrpcSchoolTermItems[] => {
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

      const attendances = classes.reduce<MinifiedAttendanceGrpc[]>(
        (acc, classEntity) => {
          const classAttendances =
            groupedAttendancesByClass[classEntity.id] || [];
          const minifiedClass = groupedMinifiedClasses[classEntity.id];

          const grpcAttendances = classAttendances.map((attendance) => {
            const enrollClassroom =
              groupedEnrolls[attendance.enroll_classroom_id];

            return grpcMinifiedAttendancesMapper({
              attendance,
              enrollClassroom,
              minifiedClass: minifiedClass
            });
          });
          return [...acc, ...grpcAttendances];
        },
        []
      );
      const classList = classes.map((classEntity) => {
        const grpcClass = new GrpcClass();
        grpcClass.setClassdate(formatDate(classEntity.class_date));
        grpcClass.setTaughtcontent(classEntity.taught_content);
        return grpcClass;
      });

      const grpcSchoolTermItems = new GrpcSchoolTermItems();
      grpcSchoolTermItems.setSchoolterm(
        shortTranslateSchoolTerm(schoolTermPeriod.school_term)
      );
      grpcSchoolTermItems.setSchooltermend(
        Timestamp.fromDate(parseDateWithoutTimezone(schoolTermPeriod.date_end))
      );
      grpcSchoolTermItems.setAttendancesList(attendances);
      grpcSchoolTermItems.setClassesList(classList);
      grpcSchoolTermItems.setSchoolreportList(
        grpcSchoolReportsBySchoolTerm[schoolTermPeriod.school_term]
      );

      return grpcSchoolTermItems;
    });
};
