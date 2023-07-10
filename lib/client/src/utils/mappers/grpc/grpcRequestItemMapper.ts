import { AttendanceCount, MinifiedAttendance } from 'models/Attendance';
import { FormattedClass, MinifiedClass } from 'models/Class';
import { ClassroomTeacherSchoolSubject } from 'models/ClassroomTeacherSchoolSubject';
import { EnrollClassroom } from 'models/EnrollClassroom';
import { Grade } from 'models/Grade';
import { GradeSchoolSubject } from 'models/GradeSchoolSubject';
import { SchoolReport } from 'models/SchoolReport';
import { SchoolSubject } from 'models/SchoolSubject';
import { SchoolTermPeriod } from 'models/SchoolTermPeriod';

import { grpcBySchoolTermMapper } from './grpcBySchoolTermMapper';

type Params = {
  school_subject: SchoolSubject;
  classroomTeacherSchoolSubject: ClassroomTeacherSchoolSubject;
  minifiedClasses: MinifiedClass[];
  classes: FormattedClass[];
  attendances: MinifiedAttendance[];
  attendancesCount: AttendanceCount[];
  gradeSchoolSubject: GradeSchoolSubject;
  schoolReports: SchoolReport[];
  enrollClassrooms: EnrollClassroom[];
  schoolTermPeriods: SchoolTermPeriod[];
  grade: Grade;
};

export const grpcRequestItemMapper = ({
  school_subject,
  classroomTeacherSchoolSubject,
  enrollClassrooms,
  classes,
  attendances,
  attendancesCount,
  minifiedClasses,
  schoolTermPeriods,
  gradeSchoolSubject,
  schoolReports,
  grade
}: Params): any => {
  const schoolReportsOfThisSchoolSubject = grade.is_multidisciplinary
    ? schoolReports
    : schoolReports.filter((schoolReport) => {
        return schoolReport.school_subject_id === school_subject.id;
      });

  const bySchoolTerm = grpcBySchoolTermMapper({
    enrollClassrooms,
    classes,
    attendances,
    minifiedClasses,
    schoolTermPeriods,
    schoolReports: schoolReportsOfThisSchoolSubject,
    attendancesCount
  });

  const newResult: any = {
    schoolSubject: school_subject.description,
    workload: gradeSchoolSubject.workload,
    bySchoolTermItems: bySchoolTerm
  };

  if (classroomTeacherSchoolSubject?.employee.name) {
    newResult.teacher = classroomTeacherSchoolSubject.employee.name;
  }

  return newResult;
};
