import { SchoolTermSchoolReports as SchoolTermSchoolReport } from 'grpc/generated/report_pb';
import { AttendanceCount } from 'models/Attendance';

import { SchoolReport } from 'models/SchoolReport';
import { LowedSchoolTerm, SchoolTerm } from 'models/SchoolTerm';
import { masks } from 'utils/masks';

type Params = {
  schoolReports: SchoolReport[];
  attendancesCount: AttendanceCount[];
};

type AbsensesBySchoolTerm = PartialRecord<SchoolTerm, number>;

type CreateItemParams = {
  schoolReport: SchoolReport;
  schoolTerm: SchoolTerm;
  absences: AbsensesBySchoolTerm;
};
export const createItem = ({
  schoolReport,
  schoolTerm,
  absences
}: CreateItemParams) => {
  const key = schoolTerm.toLowerCase().replace('-', '_') as LowedSchoolTerm;

  const average = String(schoolReport[key] || 0);
  const absencesCount = absences[schoolTerm];

  const item = new SchoolTermSchoolReport();
  item.setStudentname(schoolReport.enroll.student.name);
  item.setSchoolsubject(schoolReport.school_subject.description);
  item.setSchoolsubjectorder(schoolReport.school_subject.index);
  item.setAverage(masks['school-report'](average));

  if (typeof absencesCount !== 'undefined') {
    item.setAbsences(absencesCount);
  }

  return item;
};

export const grpcSchoolReportsBySchoolTermMapper = ({
  schoolReports,
  attendancesCount
}: Params): Record<SchoolTerm, SchoolTermSchoolReport[]> => {
  const firstItems: SchoolTermSchoolReport[] = [];
  const secondItems: SchoolTermSchoolReport[] = [];
  const firstRecItems: SchoolTermSchoolReport[] = [];
  const thirdItems: SchoolTermSchoolReport[] = [];
  const fourthItems: SchoolTermSchoolReport[] = [];
  const secondRecItems: SchoolTermSchoolReport[] = [];
  const examItems: SchoolTermSchoolReport[] = [];

  const totalAbsencesByEnroll = attendancesCount.reduce<
    Record<string, AbsensesBySchoolTerm>
  >((acc, item) => {
    const current = acc[item.enroll_id] || {};

    const currentCount = current[item.school_term!];
    const newValue =
      typeof currentCount !== 'undefined'
        ? currentCount + item.absences
        : item.absences;

    const newItem = {
      ...current,
      [item.school_term!]: newValue
    };

    return { ...acc, [item.enroll_id]: newItem };
  }, {});

  schoolReports.forEach((schoolReport) => {
    const absences = totalAbsencesByEnroll[schoolReport.enroll_id] || {};

    firstItems.push(
      createItem({ schoolReport, schoolTerm: 'FIRST', absences })
    );
    secondItems.push(
      createItem({ schoolReport, schoolTerm: 'SECOND', absences })
    );
    firstRecItems.push(
      createItem({ schoolReport, schoolTerm: 'FIRST-REC', absences })
    );
    thirdItems.push(
      createItem({ schoolReport, schoolTerm: 'THIRD', absences })
    );
    fourthItems.push(
      createItem({ schoolReport, schoolTerm: 'FOURTH', absences })
    );
    secondRecItems.push(
      createItem({ schoolReport, schoolTerm: 'SECOND-REC', absences })
    );
    examItems.push(createItem({ schoolReport, schoolTerm: 'EXAM', absences }));
  });

  return {
    FIRST: firstItems,
    SECOND: secondItems,
    'FIRST-REC': firstRecItems,
    THIRD: thirdItems,
    FOURTH: fourthItems,
    'SECOND-REC': secondRecItems,
    EXAM: examItems
  };
};
