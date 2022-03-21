import { GetServerSidePropsContext } from 'next';

import SchoolReportsTemplate from 'templates/SchoolReports';

import protectedRoutes from 'utils/protected-routes';

function SchoolReportsPage() {
  return <SchoolReportsTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return {
    props: {
      session
    }
  };
}

SchoolReportsPage.auth = {
  module: 'SCHOOL_REPORT'
};

export default SchoolReportsPage;
