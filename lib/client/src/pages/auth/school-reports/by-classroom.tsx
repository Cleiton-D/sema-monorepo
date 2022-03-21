import { GetServerSidePropsContext } from 'next';

import SchoolReportsByClassroomTemplate from 'templates/SchoolReportsByClassroom';

import protectedRoutes from 'utils/protected-routes';

function SchoolReportsByClassroomPage() {
  return <SchoolReportsByClassroomTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return {
    props: {
      session
    }
  };
}

SchoolReportsByClassroomPage.auth = {
  module: 'SCHOOL_REPORT'
};

export default SchoolReportsByClassroomPage;
