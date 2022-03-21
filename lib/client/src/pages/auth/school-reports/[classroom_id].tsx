import { GetServerSidePropsContext } from 'next';

import ClassroomSchoolReport from 'templates/ClassroomSchoolReport';

import protectedRoutes from 'utils/protected-routes';

function ClassroomSchoolReportPage() {
  return <ClassroomSchoolReport />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return {
    props: {
      session
    }
  };
}

ClassroomSchoolReportPage.auth = {
  module: 'SCHOOL_REPORT'
};

export default ClassroomSchoolReportPage;
