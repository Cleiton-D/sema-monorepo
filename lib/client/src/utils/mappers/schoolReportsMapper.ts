import { Attendance } from 'models/Attendance';
import {
  SchoolReport,
  MappedSchoolReportSubject,
  MappedAttendanceSchoolSubject
} from 'models/SchoolReport';

export const schoolReportsSubjectsMapper = (
  schoolReports: SchoolReport[],
  attendances: Attendance[] = []
): MappedSchoolReportSubject[] => {
  const groupedAttendances = attendances.reduce<
    Record<string, MappedAttendanceSchoolSubject>
  >((acc, attendance) => {
    const { school_term, school_subject } = attendance.class;
    const current = acc[school_subject.id] || {};
    const key =
      `attendances-${school_term}` as keyof MappedAttendanceSchoolSubject;

    const currentValue = (current[key] || 0) as number;

    // se estava presente ignora, se nao adiciona mais uma falta
    const sumValue = attendance.attendance ? 0 : 1;
    const newItem = {
      ...current,
      school_subject: school_subject.description,
      [key]: currentValue + sumValue
    };

    return {
      ...acc,
      [school_subject.id]: newItem
    };
  }, {});

  const groupedSchoolReports = schoolReports.reduce<
    Record<string, MappedSchoolReportSubject>
  >((acc, schoolReport) => {
    const { school_subject_id, school_subject } = schoolReport;

    const item = acc[school_subject_id] || {};

    const newItem = {
      ...item,
      school_subject: school_subject.description,
      first: schoolReport.first || '-',
      second: schoolReport.second || '-',
      first_rec: schoolReport.first_rec || '-',
      third: schoolReport.third || '-',
      fourth: schoolReport.fourth || '-',
      second_rec: schoolReport.second_rec || '-',
      exam: schoolReport.exam || '-'
    };

    return { ...acc, [school_subject_id]: newItem };
  }, {});

  const arrayKeys = [
    ...Object.keys(groupedAttendances),
    ...Object.keys(groupedSchoolReports)
  ];
  const uniqueKeys = [...new Set(arrayKeys)];

  return uniqueKeys.map((key) => {
    const itemAttendances = groupedAttendances[key];
    const itemSchoolReports = groupedSchoolReports[key];

    return { ...itemAttendances, ...itemSchoolReports };
  });
};

export const schoolReportsEnrollsMapper = (schoolReport: SchoolReport) => {
  return {
    ...schoolReport,
    formattedAverages: {
      first: schoolReport.first || '-',
      second: schoolReport.second || '-',
      first_rec: schoolReport.first_rec || '-',
      third: schoolReport.third || '-',
      fourth: schoolReport.fourth || '-',
      second_rec: schoolReport.second_rec || '-',
      exam: schoolReport.exam || '-'
    }
  };
};
