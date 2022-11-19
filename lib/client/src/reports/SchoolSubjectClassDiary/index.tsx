import React, { useMemo } from 'react';

import Page from 'reports/Page';
import NominalRelationReport from 'reports/NominalRelation';
import AttendancesReport from 'reports/Attendances';
import ClassesReport from 'reports/Classes';
import SchoolTermSchoolReports from 'reports/SchoolTermSchoolReports';

import { Classroom } from 'models/Classroom';
import { ClassroomTeacherSchoolSubject } from 'models/ClassroomTeacherSchoolSubject';
import { EnrollClassroom } from 'models/EnrollClassroom';
import { SchoolSubject } from 'models/SchoolSubject';
import { Class, MinifiedClass } from 'models/Class';
import { MinifiedAttendance } from 'models/Attendance';
import { SchoolTermPeriod } from 'models/SchoolTermPeriod';
import { GradeSchoolSubject } from 'models/GradeSchoolSubject';
import { SchoolTerm } from 'models/SchoolTerm';
import { SchoolReport } from 'models/SchoolReport';

import Cover from './Cover';

import { orderSchoolTerm } from 'utils/mappers/schoolTermPeriodMapper';

type GroupedClassesBySchoolTerm = PartialRecord<
  SchoolTerm,
  {
    attendances?: MinifiedAttendance[];
    minifiedClasses?: MinifiedClass[];
    classes?: Class[];
  }
>;
// import * as S from './styles';

export type ClassDiaryReportTemplateProps = {
  classroom: Classroom;
  enrollClassrooms: EnrollClassroom[];
  schoolTermPeriods: SchoolTermPeriod[];
  school_subject: SchoolSubject;
  classroomTeacherSchoolSubject: ClassroomTeacherSchoolSubject;
  minifiedClasses: MinifiedClass[];
  classes: Class[];
  attendances: MinifiedAttendance[];
  gradeSchoolSubject: GradeSchoolSubject;
  schoolReports: SchoolReport[];
};

const SchoolSubjectClassDiary = ({
  classroom,
  enrollClassrooms,
  schoolTermPeriods,
  school_subject,
  classroomTeacherSchoolSubject,
  minifiedClasses,
  classes,
  attendances,
  gradeSchoolSubject,
  schoolReports
}: ClassDiaryReportTemplateProps) => {
  const groupedAttendances = useMemo(() => {
    return attendances.reduce<Record<string, MinifiedAttendance[]>>(
      (acc, item) => {
        const current = acc[item.class_id] || [];

        return { ...acc, [item.class_id]: [...current, item] };
      },
      {}
    );
  }, [attendances]);
  const groupedMinifiedClasses = useMemo(() => {
    return minifiedClasses.reduce<Record<string, MinifiedClass>>(
      (acc, classEntity) => {
        return { ...acc, [classEntity.id]: classEntity };
      },
      {}
    );
  }, [minifiedClasses]);

  const groupedClassesAndAttendancesBySchoolTerm = useMemo(() => {
    return classes.reduce<GroupedClassesBySchoolTerm>((acc, classEntity) => {
      const itemAttendances = groupedAttendances[classEntity.id];
      const minifiedClass = groupedMinifiedClasses[classEntity.id];

      const current = acc[classEntity.school_term] || {};
      const currentMinifiedClasses = current.minifiedClasses || [];
      const currentClasses = current.classes || [];
      const currentAttendances = current.attendances || [];

      const newItem = {
        ...current,
        minifiedClasses: [...currentMinifiedClasses, minifiedClass],
        classes: [...currentClasses, classEntity],
        attendances: [...currentAttendances, ...itemAttendances]
      };
      return { ...acc, [classEntity.school_term]: newItem };
    }, {});
  }, [classes, groupedAttendances, groupedMinifiedClasses]);

  const mappedBySchoolTerm = useMemo(() => {
    return schoolTermPeriods.map((schoolTermPeriod) => {
      const {
        attendances = [],
        classes = [],
        minifiedClasses = []
      } = groupedClassesAndAttendancesBySchoolTerm[
        schoolTermPeriod.school_term
      ] || {};

      return { attendances, minifiedClasses, classes, schoolTermPeriod };
    });
  }, [groupedClassesAndAttendancesBySchoolTerm, schoolTermPeriods]);

  const ordenedSchoolTermPeriods = useMemo(() => {
    return schoolTermPeriods.sort((a, b) =>
      orderSchoolTerm(a.school_term, b.school_term)
    );
  }, [schoolTermPeriods]);

  return (
    <div>
      <Page orientation="portrait">
        <Cover
          classroom={classroom}
          schoolSubject={school_subject}
          classroomTeacherSchoolSubject={classroomTeacherSchoolSubject}
        />
      </Page>

      <Page orientation="portrait">
        <NominalRelationReport
          classroom={classroom}
          enrollClassrooms={enrollClassrooms}
          usePadding={false}
        />
      </Page>

      {mappedBySchoolTerm.map((item) => (
        <React.Fragment key={item.schoolTermPeriod.id}>
          {item.minifiedClasses.length > 0 && (
            <Page orientation="landscape">
              <AttendancesReport
                schoolSubject={school_subject}
                classroom={classroom}
                attendances={item.attendances}
                enrollClassrooms={enrollClassrooms}
                classes={item.minifiedClasses}
                schoolTermPeriod={item.schoolTermPeriod}
                usePadding={false}
              />
            </Page>
          )}

          {item.classes.length > 0 && (
            <Page orientation="portrait">
              <ClassesReport
                schoolSubject={school_subject}
                classroom={classroom}
                schoolTermPeriod={item.schoolTermPeriod}
                gradeSchoolSubject={gradeSchoolSubject}
                classes={item.classes}
                usePadding={false}
              />
            </Page>
          )}
        </React.Fragment>
      ))}

      {ordenedSchoolTermPeriods.map((schoolTermPeriod) => (
        <Page orientation="portrait" key={schoolTermPeriod.id}>
          <SchoolTermSchoolReports
            searchedSchoolSubject={school_subject}
            schoolTermPeriod={schoolTermPeriod}
            schoolReports={schoolReports}
          />
        </Page>
      ))}
    </div>
  );
};

export default SchoolSubjectClassDiary;
