import { AttendanceCount } from 'models/Attendance';
import {
  SchoolReport,
  MappedSchoolReportSubject,
  MappedSchoolReportSubjectWithAttendances
} from 'models/SchoolReport';
import { SchoolSubject } from 'models/SchoolSubject';
import { SchoolTerm } from 'models/SchoolTerm';
import { masks } from 'utils/masks';

type AttendancesKey = `attendances-${SchoolTerm}`;

export const schoolReportsSubjectsMapper = (
  schoolReports: SchoolReport[],
  attendances: AttendanceCount[] = [],
  schoolSubjects: SchoolSubject[] = []
): MappedSchoolReportSubjectWithAttendances[] => {
  const groupedAttendances = attendances.reduce<
    Record<string, Record<AttendancesKey, number>>
  >((acc, attendance) => {
    const { school_term, school_subject_id } = attendance;

    const itemKey = school_subject_id;

    const current = acc[itemKey] || {};
    const key = `attendances-${school_term}` as AttendancesKey;

    const newItem = {
      ...current,
      [key]: attendance.absences
    };

    return {
      ...acc,
      [itemKey]: newItem
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
      FIRST: schoolReport.first || '-',
      SECOND: schoolReport.second || '-',
      'FIRST-REC': schoolReport.first_rec || '-',
      THIRD: schoolReport.third || '-',
      FOURTH: schoolReport.fourth || '-',
      'SECOND-REC': schoolReport.second_rec || '-',
      EXAM: schoolReport.exam || '-',
      finalAverage: schoolReport.final_average || '-',
      annualAverage: schoolReport.annual_average || '-'
    };

    return { ...acc, [school_subject_id]: newItem };
  }, {});

  return schoolSubjects.map((item) => {
    const itemAttendances = groupedAttendances[item.id] || {};
    const itemSchoolReports = groupedSchoolReports[item.id];

    const attendancesKeys = Object.keys(itemAttendances) as AttendancesKey[];
    const uniqueAttendancesKeys = [...new Set(attendancesKeys)];

    const finalAttendances = uniqueAttendancesKeys.reduce<
      Record<AttendancesKey, number>
    >((acc, key) => {
      const total = itemAttendances[key] || 0;

      return { ...acc, [key]: total };
    }, {} as Record<AttendancesKey, number>);

    const totalAttendances = Object.values(finalAttendances).reduce(
      (acc, item) => acc + item,
      0
    );

    return {
      ...itemSchoolReports,
      ...finalAttendances,
      totalAttendances,
      school_subject: item.description
    };
  });
};

export const schoolReportsEnrollsMapper = (schoolReport: SchoolReport) => {
  return {
    ...schoolReport,
    formattedAverages: {
      first: schoolReport.first
        ? masks['school-report'](`${schoolReport.first}`)
        : '-',
      second: schoolReport.second
        ? masks['school-report'](`${schoolReport.second}`)
        : '-',
      first_rec: schoolReport.first_rec
        ? masks['school-report'](`${schoolReport.first_rec}`)
        : '-',
      third: schoolReport.third
        ? masks['school-report'](`${schoolReport.third}`)
        : '-',
      fourth: schoolReport.fourth
        ? masks['school-report'](`${schoolReport.fourth}`)
        : '-',
      second_rec: schoolReport.second_rec
        ? masks['school-report'](`${schoolReport.second_rec}`)
        : '-',
      exam: schoolReport.exam
        ? masks['school-report'](`${schoolReport.exam}`)
        : '-'
    }
  };
};
