import { NextApiRequest, NextApiResponse } from 'next';

import { listSchoolReports } from 'requests/queries/school-reports';

import { showClassroom } from 'requests/queries/classrooms';
import { showGrade } from 'requests/queries/grades';
import { listEnrollClassrooms } from 'requests/queries/enroll-classrooms';

import { grpcFinalResultMapper } from 'utils/mappers/grpc/grpcFinalResultMapper';
import { withSessionRoute } from 'utils/session/withSession';
import { createUnstableApi } from 'services/api';

export default withSessionRoute(
  async (request: NextApiRequest, response: NextApiResponse) => {
    const { classroom_id, extension } = request.query;

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

    const enrollClassrooms = await listEnrollClassrooms(
      {
        classroom_id: classroom_id as string
      },
      request.session
    );

    const schoolReports = await listSchoolReports(
      {
        classroom_id: classroom.id,
        grade_id: grade.id
      },
      request.session
    );

    const finalResult = grpcFinalResultMapper({
      enrollClassrooms,
      schoolReports
    });

    const newRequestData = {
      schoolName: classroom.school?.name,
      grade: grade.description,
      classroom: classroom.description,
      classPeriod: classroom.class_period.description,
      referenceYear: schoolYear.reference_year,
      schoolYearEndDate: schoolYear.date_end,
      finalResult: finalResult
    };

    const { data } = await api.post(
      `${process.env.REPORT_ENGINE_URL}/generate/final-result`,
      newRequestData,
      { params: { extension }, responseType: 'arraybuffer' }
    );

    const filename = `Ata_${classroom.description.replace(/\s/g, '_')}_${
      classroom.school?.name
    }.${extension}`;

    const contentTypeMap = {
      pdf: 'application/pdf',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

    response.setHeader(
      'Content-Type',
      contentTypeMap[extension as 'pdf' | 'xlsx']
    );

    response.setHeader('Content-Disposition', `inline; filename=${filename}`);

    return response.send(data);
  }
);
