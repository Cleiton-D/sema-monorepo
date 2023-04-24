import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import * as grpc from '@grpc/grpc-js';

import { listSchoolReports } from 'requests/queries/school-reports';

import { getApiSession } from 'utils/getApiSession';
import { showClassroom } from 'requests/queries/classrooms';
import { showGrade } from 'requests/queries/grades';
import { listEnrollClassrooms } from 'requests/queries/enroll-classrooms';

import {
  FileResponse,
  FinalResultGenerateRequest
} from 'grpc/generated/report_pb';

import { FinalResultServiceClient } from 'grpc/generated/report_grpc_pb';
import { grpcFinalResultMapper } from 'utils/mappers/grpc/grpcFinalResultMapper';
import { showSchoolYear } from 'requests/queries/school-year';

// const client = new ClassDiaryClient(
//   'localhost:9000',
//   grpc.credentials.createInsecure()
// );

const client = new FinalResultServiceClient(
  process.env.REPORT_ENGINE_URL as string,
  grpc.credentials.createInsecure()
);

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { classroom_id } = request.query;

  const session = await getApiSession<Session>(request);
  if (!session) return;

  const schoolYear = await showSchoolYear(session, {
    id: session.configs.school_year_id
  });
  if (!schoolYear) return;

  const classroom = await showClassroom(session, {
    id: classroom_id as string
  });
  const grade = await showGrade(session, classroom.grade_id);
  if (!grade) return;

  const enrollClassrooms = await listEnrollClassrooms(session, {
    classroom_id: classroom_id as string
  });

  const schoolReports = await listSchoolReports(session, {
    classroom_id: classroom.id,
    grade_id: grade.id
  });

  const finalResult = grpcFinalResultMapper({
    enrollClassrooms,
    schoolReports
  });

  const requestData = new FinalResultGenerateRequest();
  requestData.setSchoolname(classroom.school?.name as string);
  requestData.setGrade(grade.description);
  requestData.setClassroom(classroom.description);
  requestData.setClassperiod(classroom.class_period.description);
  requestData.setReferenceyear(schoolYear.reference_year);
  requestData.setFinalresultList(finalResult);

  const promise = new Promise<FileResponse>((resolve, reject) => {
    client.generate(requestData, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });

  const result = await promise;
  const byteArray = Buffer.from(result.getFilechunk_asU8());

  const filename = `Ata_${classroom.description.replace(/\s/g, '_')}_${
    classroom.school?.name
  }.pdf`;

  response.setHeader('Content-Type', 'application/pdf');
  //response.setHeader(
   // 'Content-Type',
   // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  //);
  response.setHeader('Content-Disposition', `inline; filename=${filename}`);

  return response.send(byteArray);
};
