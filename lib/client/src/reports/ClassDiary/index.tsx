import React, { useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';

import { Classroom } from 'models/Classroom';
import { ClassroomTeacherSchoolSubject } from 'models/ClassroomTeacherSchoolSubject';
import { EnrollClassroom } from 'models/EnrollClassroom';
import { SchoolSubject } from 'models/SchoolSubject';
import { Class, MinifiedClass } from 'models/Class';
import { MinifiedAttendance } from 'models/Attendance';
import { SchoolTermPeriod } from 'models/SchoolTermPeriod';
import { GradeSchoolSubject } from 'models/GradeSchoolSubject';
import { SchoolReport } from 'models/SchoolReport';

import SchoolSubjectClassDiary from 'reports/SchoolSubjectClassDiary';

export type GroupedItem = {
  school_subject: SchoolSubject;
  classroomTeacherSchoolSubject: ClassroomTeacherSchoolSubject;
  minifiedClasses: MinifiedClass[];
  classes: Class[];
  attendances: MinifiedAttendance[];
  gradeSchoolSubject: GradeSchoolSubject;
  schoolReports: SchoolReport[];
};

export type ClassDiaryReportTemplateProps = {
  classroom: Classroom;
  enrollClassrooms: EnrollClassroom[];
  schoolTermPeriods: SchoolTermPeriod[];
  groupedItems: GroupedItem[];
};

const ClassDiaryReportTemplate = ({
  classroom,
  enrollClassrooms,
  schoolTermPeriods,
  groupedItems
}: ClassDiaryReportTemplateProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (containerRef.current) {
  //       const doc = new jsPDF();
  //       doc.html(containerRef.current, {
  //         windowWidth: window.innerWidth,
  //         width: 170,
  //         callback: () => {
  //           const blob = doc.output('blob');
  //           const dataUrl = URL.createObjectURL(blob);

  //           const element = document.createElement('a');
  //           element.href = dataUrl;
  //           element.target = '_blank';
  //           element.click();
  //         }
  //       });
  //     }
  //   }, 500);
  // }, []);

  return (
    <div ref={containerRef}>
      {/* <style jsx global>{`
        @page {
          size: A4 portrait;
        }
      `}</style> */}

      {groupedItems.map((item) => (
        <SchoolSubjectClassDiary
          key={item.school_subject.id}
          classroom={classroom}
          enrollClassrooms={enrollClassrooms}
          schoolTermPeriods={schoolTermPeriods}
          school_subject={item.school_subject}
          classroomTeacherSchoolSubject={item.classroomTeacherSchoolSubject}
          gradeSchoolSubject={item.gradeSchoolSubject}
          minifiedClasses={item.minifiedClasses}
          classes={item.classes}
          attendances={item.attendances}
          schoolReports={item.schoolReports}
        />
      ))}
    </div>
  );
};

export default ClassDiaryReportTemplate;
