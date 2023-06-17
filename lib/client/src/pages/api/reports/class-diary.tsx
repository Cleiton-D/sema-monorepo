import { NextApiRequest, NextApiResponse } from 'next';
import * as grpc from '@grpc/grpc-js';

import { Classroom } from 'models/Classroom';
import { Grade } from 'models/Grade';
import { SchoolSubject } from 'models/SchoolSubject';

import {
  countAttendances,
  listAttendancesByClasses
} from 'requests/queries/attendances';
import { listClasses } from 'requests/queries/class';
import { listClassroomTeacherSchoolSubjects } from 'requests/queries/classroom-teacher-school-subjects';
import { listGradeSchoolSubjects } from 'requests/queries/grade-school-subjects';
import { listSchoolReports } from 'requests/queries/school-reports';

import { showClassroom } from 'requests/queries/classrooms';
import { showGrade } from 'requests/queries/grades';
import { listSchoolSubjects } from 'requests/queries/school-subjects';
import { listEnrollClassrooms } from 'requests/queries/enroll-classrooms';

import {
  ClassDiaryGenerateRequest,
  FileResponse
} from 'grpc/generated/report_pb';

import { ClassDiaryClient } from 'grpc/generated/report_grpc_pb';
import { grpcEnrollmentMapper } from 'utils/mappers/grpc/grpcEnrollmentMapper';
import { grpcRequestItemMapper } from 'utils/mappers/grpc/grpcRequestItemMapper';
import { listSchoolTermPeriods } from 'requests/queries/school-term-periods';
import { grpcFinalResultMapper } from 'utils/mappers/grpc/grpcFinalResultMapper';
import { withSessionRoute } from 'utils/session/withSession';
import { createUnstableApi } from 'services/api';

// const client = new ClassDiaryClient(
//   'localhost:9000',
//   grpc.credentials.createInsecure()
// );

const client = new ClassDiaryClient(
  process.env.REPORT_ENGINE_URL as string,
  grpc.credentials.createInsecure()
);

const getItemsBySchoolSubject = async (
  classroom: Classroom,
  grade: Grade,
  schoolSubject: SchoolSubject,
  session?: AppSession
) => {
  const [classroomTeacherSchoolSubject] =
    await listClassroomTeacherSchoolSubjects(
      {
        classroom_id: classroom.id,
        school_subject_id: schoolSubject.id,
        is_multidisciplinary: null
      },
      session
    );

  const { classes: minifiedClasses, attendances } =
    await listAttendancesByClasses(
      {
        classroom_id: classroom.id,
        // employee_id: classroomTeacherSchoolSubject.employee_id,
        school_subject_id: schoolSubject.id,
        // school_term: schoolTermPeriod?.school_term,
        sortBy: 'class_date',
        order: 'ASC'
      },
      session
    );

  const attendancesCount = await countAttendances(
    {
      attendance: false,
      classroom_id: classroom.id,
      school_subject_id: !grade.is_multidisciplinary
        ? schoolSubject.id
        : undefined,
      split_by_school_term: true
    },
    session
  );

  const classesResponse = await listClasses(
    {
      classroom_id: classroom.id,
      school_subject_id: schoolSubject.id,
      sortBy: 'class_date',
      order: 'ASC'
    },
    session
  );

  const gradeSchoolSubject = await listGradeSchoolSubjects(
    {
      grade_id: classroom.grade_id,
      school_subject_id: schoolSubject.id,
      include_multidisciplinary: true
    },
    session
  );

  return {
    school_subject: schoolSubject,
    classroomTeacherSchoolSubject: classroomTeacherSchoolSubject || null,
    minifiedClasses,
    classes: classesResponse?.items || [],
    attendances,
    attendancesCount,
    gradeSchoolSubject: gradeSchoolSubject?.[0] || null
  };
};

export default withSessionRoute(
  async (request: NextApiRequest, response: NextApiResponse) => {
    const { classroom_id } = request.query;

    const api = createUnstableApi();
    api.defaults.headers = { cookie: request.headers.cookie };

    const schoolYear = await api
      .get(`${process.env.APP_URL_INTERNAL}/api/session/school-year`)
      .then((response) => response.data)
      .catch(() => undefined);

    const classroom = await showClassroom(
      {
        id: classroom_id as string
      },
      request.session
    );
    const grade = await showGrade(classroom.grade_id, request.session);
    if (!grade) return;

    const schoolSubjects = await listSchoolSubjects(
      {
        grade_id: grade?.id,
        is_multidisciplinary: grade?.is_multidisciplinary,
        school_year_id: schoolYear.id
      },
      request.session
    );

    const groupedItems = await Promise.all(
      schoolSubjects.map((schoolSubject) =>
        getItemsBySchoolSubject(
          classroom,
          grade,
          schoolSubject,
          request.session
        )
      )
    );

    const enrollClassrooms = await listEnrollClassrooms(
      {
        classroom_id: classroom_id as string
      },
      request.session
    );

    const schoolTermPeriods = await listSchoolTermPeriods(
      {
        school_year_id: schoolYear.id
      },
      request.session
    );

    const schoolReports = await listSchoolReports(
      {
        classroom_id: classroom.id,
        // school_subject_id: !grade.is_multidisciplinary
        //   ? schoolSubject.id
        //   : undefined,
        grade_id: grade.id
      },
      request.session
    );

    const items = groupedItems.map((item) =>
      grpcRequestItemMapper({
        ...item,
        enrollClassrooms,
        schoolTermPeriods,
        schoolReports,
        grade
      })
    );

    const enrolls = enrollClassrooms.map(grpcEnrollmentMapper);
    const finalResult = grpcFinalResultMapper({
      enrollClassrooms,
      schoolReports
    });

    const requestData = new ClassDiaryGenerateRequest();
    requestData.setSchoolname(classroom.school?.name as string);
    requestData.setGrade(grade.description);
    requestData.setClassroom(classroom.description);
    requestData.setClassperiod(classroom.class_period.description);
    requestData.setReferenceyear(schoolYear.reference_year);
    requestData.setItemsList(items);
    requestData.setEnrollsList(enrolls);
    requestData.setFinalresultList(finalResult);

    const promise = new Promise<FileResponse>((resolve, reject) => {
      client.generate(requestData, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });

    const result = await promise;
    const byteArray = Buffer.from(result.getFilechunk_asU8());

    const filename = `Relatorio_final_${classroom.description.replace(
      /\s/g,
      '_'
    )}_${classroom.school?.name}.pdf`;

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `inline; filename=${filename}`);

    return response.send(byteArray);
  }
);
