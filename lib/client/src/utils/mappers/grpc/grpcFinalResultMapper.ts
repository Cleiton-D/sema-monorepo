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
}: Params): any[] => {
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

      return {
        studentName: enroll.student.name,
        schoolSubject: schoolReport.school_subject.description,
        schoolSubjectOrder: schoolReport.school_subject.index,
        finalResult: translateStatus(enroll.status),
        average: masks['school-report'](average)
      };
    })
    .filter((finalResult) => !!finalResult);
};
