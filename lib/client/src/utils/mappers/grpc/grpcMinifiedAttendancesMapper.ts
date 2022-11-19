import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

import { MinifiedAttendance as MinifiedAttendanceGrpc } from 'grpc/generated/report_pb';
import { MinifiedAttendance as MinifiedAttendanceModel } from 'models/Attendance';
import { MinifiedClass } from 'models/Class';
import { EnrollClassroom } from 'models/EnrollClassroom';

import { parseDateWithoutTimezone } from 'utils/parseDateWithoutTimezone';

type Params = {
  attendance: MinifiedAttendanceModel;
  enrollClassroom: EnrollClassroom;
  minifiedClass: MinifiedClass;
};

export const grpcMinifiedAttendancesMapper = ({
  attendance,
  enrollClassroom,
  minifiedClass
}: Params) => {
  const grpcAttendance = new MinifiedAttendanceGrpc();
  grpcAttendance.setStudentName(enrollClassroom.enroll.student.name);
  grpcAttendance.setClassDate(
    Timestamp.fromDate(parseDateWithoutTimezone(minifiedClass.class_date))
  );
  grpcAttendance.setAttendance(attendance.attendance);

  return grpcAttendance;
};
