import { FinalResult as GrpcFinalResult } from 'grpc/generated/report_pb';
import { Enroll } from 'models/Enroll';

import { EnrollClassroom } from 'models/EnrollClassroom';
import { SchoolReport } from 'models/SchoolReport';

import { masks } from 'utils/masks';
import { translateStatus } from 'utils/translateStatus';

type Params = {
  enrollClassrooms: EnrollClassroom[];
  schoolReports: SchoolReport[];
};
export const grpcFinalResultMapper = ({
  enrollClassrooms,
  schoolReports
}: Params): GrpcFinalResult[] => {
  const enrollClassroomsMap = enrollClassrooms.reduce<Record<string, Enroll>>(
    (acc, enrollClassroom) => {
      return { ...acc, [enrollClassroom.enroll_id]: enrollClassroom.enroll };
    },
    {}
  );

  return schoolReports
    .map((schoolReport) => {
      const enroll = enrollClassroomsMap[schoolReport.enroll_id];
      if (!enroll) return null;

      const average = String(schoolReport.final_average || 0);

      const finalResult = new GrpcFinalResult();
      finalResult.setSchoolsubject(schoolReport.school_subject.description);
      finalResult.setSchoolsubjectorder(schoolReport.school_subject.index);
      finalResult.setAverage(masks['school-report'](average));
      finalResult.setStudentname(enroll.student.name);
      finalResult.setFinalresult(translateStatus(enroll.status));

      return finalResult;
    })
    .filter((finalResult) => !!finalResult) as GrpcFinalResult[];
};
