import { SchoolSubjectClassDiary } from 'grpc/generated/report_pb';

import { AttendanceCount, MinifiedAttendance } from 'models/Attendance';
import { FormattedClass, MinifiedClass } from 'models/Class';
import { ClassroomTeacherSchoolSubject } from 'models/ClassroomTeacherSchoolSubject';
import { EnrollClassroom } from 'models/EnrollClassroom';
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
  schoolReports
}: Params): SchoolSubjectClassDiary => {
  const schoolReportsOfThisSchoolSubject = schoolReports.filter(
    (schoolReport) => {
      return schoolReport.school_subject_id === school_subject.id;
    }
  );

  const result = new SchoolSubjectClassDiary();
  result.setSchoolsubject(school_subject.description);
  result.setWorkload(gradeSchoolSubject.workload);

  if (classroomTeacherSchoolSubject?.employee.name) {
    result.setTeacher(classroomTeacherSchoolSubject.employee.name);
  }

  const bySchoolTerm = grpcBySchoolTermMapper({
    enrollClassrooms,
    classes,
    attendances,
    minifiedClasses,
    schoolTermPeriods,
    schoolReports: schoolReportsOfThisSchoolSubject,
    attendancesCount
  });
  result.setByschooltermList(bySchoolTerm);

  return result;
};
