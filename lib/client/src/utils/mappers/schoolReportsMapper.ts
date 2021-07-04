import {
  SchoolReport,
  MappedSchoolReportSubject,
  MappedSchoolReportEnroll
} from 'models/SchoolReport';

export const schoolReportsSubjectsMapper = (
  schoolReports: SchoolReport[]
): MappedSchoolReportSubject[] => {
  const result = schoolReports.reduce<
    Record<string, MappedSchoolReportSubject>
  >((acc, schoolReport) => {
    const {
      school_subject_id,
      school_subject,
      school_term,
      average
    } = schoolReport;

    const item = acc[school_subject_id] || {};

    const newItem = {
      ...item,
      school_subject: school_subject.description,
      [school_term]: average || '-'
    };

    return { ...acc, [school_subject_id]: newItem };
  }, {});

  return Object.values(result);
};

export const schoolReportsEnrollsMapper = (schoolReports: SchoolReport[]) => {
  const result = schoolReports.reduce<Record<string, MappedSchoolReportEnroll>>(
    (acc, schoolReport) => {
      const { enroll_id, enroll, school_term, average } = schoolReport;
      const item = acc[enroll_id] || {};

      const newItem = {
        ...item,
        enroll,
        [school_term]: average || '-'
      };

      return { ...acc, [enroll_id]: newItem };
    },
    {}
  );

  return Object.values(result);
};
