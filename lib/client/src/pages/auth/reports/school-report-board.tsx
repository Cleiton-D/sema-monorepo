import { GetServerSidePropsContext } from 'next';

import SchoolReportBoardTemplate from 'templates/Reports/SchoolReportBoard';

import protectedRoutes from 'utils/protected-routes';

function SchoolReportBoard() {
  return <SchoolReportBoardTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return {
    props: {
      session
    }
  };
}

SchoolReportBoard.auth = {
  module: 'SCHOOL_REPORT'
};

export default SchoolReportBoard;
