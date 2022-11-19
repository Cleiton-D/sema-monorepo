import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
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

import { getApiSession } from 'utils/getApiSession';
import { showClassroom } from 'requests/queries/classrooms';
import { showGrade } from 'requests/queries/grades';
import { listSchoolSubjects } from 'requests/queries/school-subjects';
import { listEnrollClassrooms } from 'requests/queries/enroll-classrooms';

import {
  ClassDiaryGenerateRequest,
  ClassDiaryGenerateResponse
} from 'grpc/generated/report_pb';

import { ClassDiaryClient } from 'grpc/generated/report_grpc_pb';
import { grpcEnrollmentMapper } from 'utils/mappers/grpc/grpcEnrollmentMapper';
import { grpcRequestItemMapper } from 'utils/mappers/grpc/grpcRequestItemMapper';
import { listSchoolTermPeriods } from 'requests/queries/school-term-periods';
import { grpcFinalResultMapper } from 'utils/mappers/grpc/grpcFinalResultMapper';

// const client = new ClassDiaryClient(
//   'localhost:9000',
//   grpc.credentials.createInsecure()
// );

const client = new ClassDiaryClient(
  process.env.REPORT_ENGINE_URL as string,
  grpc.credentials.createInsecure()
);

const getItemsBySchoolSubject = async (
  session: Session | null,
  classroom: Classroom,
  grade: Grade,
  schoolSubject: SchoolSubject
) => {
  const [classroomTeacherSchoolSubject] =
    await listClassroomTeacherSchoolSubjects(session, {
      classroom_id: classroom.id,
      school_subject_id: schoolSubject.id,
      is_multidisciplinary: null
    });

  const { classes: minifiedClasses, attendances } =
    await listAttendancesByClasses(session, {
      classroom_id: classroom.id,
      // employee_id: classroomTeacherSchoolSubject.employee_id,
      school_subject_id: schoolSubject.id,
      // school_term: schoolTermPeriod?.school_term,
      sortBy: 'class_date',
      order: 'ASC'
    });

  const attendancesCount = await countAttendances(session, {
    attendance: false,
    classroom_id: classroom.id,
    school_subject_id: !grade.is_multidisciplinary
      ? schoolSubject.id
      : undefined,
    split_by_school_term: true
  });

  const classesResponse = await listClasses(session, {
    classroom_id: classroom.id,
    school_subject_id: schoolSubject.id,
    sortBy: 'class_date',
    order: 'ASC'
  });

  const gradeSchoolSubject = await listGradeSchoolSubjects(session, {
    grade_id: classroom.grade_id,
    school_subject_id: schoolSubject.id,
    include_multidisciplinary: true
  });

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

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { classroom_id } = request.query;

  const session = await getApiSession(request);
  if (!session) return;

  const classroom = await showClassroom(session, {
    id: classroom_id as string
  });
  const grade = await showGrade(session, classroom.grade_id);
  if (!grade) return;

  const schoolSubjects = await listSchoolSubjects(session, {
    grade_id: grade?.id,
    is_multidisciplinary: grade?.is_multidisciplinary
  });

  const groupedItems = await Promise.all(
    schoolSubjects.map((schoolSubject) =>
      getItemsBySchoolSubject(session, classroom, grade, schoolSubject)
    )
  );

  const enrollClassrooms = await listEnrollClassrooms(session, {
    classroom_id: classroom_id as string
  });

  const schoolTermPeriods = await listSchoolTermPeriods(session, {
    school_year_id: session.configs.school_year_id
  });

  const schoolReports = await listSchoolReports(session, {
    classroom_id: classroom.id,
    // school_subject_id: !grade.is_multidisciplinary
    //   ? schoolSubject.id
    //   : undefined,
    grade_id: grade.id
  });

  const items = groupedItems.map((item) =>
    grpcRequestItemMapper({
      ...item,
      enrollClassrooms,
      schoolTermPeriods,
      schoolReports
    })
  );

  const enrolls = enrollClassrooms.map(grpcEnrollmentMapper);
  const finalResult = grpcFinalResultMapper({
    enrollClassrooms,
    schoolReports
  });

  const startTime = Date.now();

  const requestData = new ClassDiaryGenerateRequest();
  requestData.setSchoolname(classroom.school?.name as string);
  requestData.setGrade(grade.description);
  requestData.setClassroom(classroom.description);
  requestData.setClassperiod(classroom.class_period.description);
  requestData.setReferenceyear('2022');
  requestData.setItemsList(items);
  requestData.setEnrollsList(enrolls);
  requestData.setFinalresultList(finalResult);

  const promise = new Promise<ClassDiaryGenerateResponse>((resolve, reject) => {
    client.generate(requestData, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });

  const result = await promise;
  const byteArray = Buffer.from(result.getFilechunk_asU8());
  const endTime = Date.now();

  console.log(`time: ${endTime - startTime} miliseconds`);

  response.setHeader('Content-Type', 'application/pdf');
  return response.send(byteArray);

  // const { data: source } = await api.get<string>(
  //   `${process.env.APP_URL_INTERNAL}/auth/exports/class-diary`,
  //   {
  //     params: request.query
  //   }
  // );
  // console.log(source);

  // const output = document.output('blob');
  // document.save('teste');

  // return response.json({ ok: true });

  // response.setHeader('Content-Type', 'application/pdf');
  // response.setHeader('Content-Disposition', 'attachment; filename=dummy.pdf');

  // return response.send(output);
};
