// import SchoolReportBoardTemplate from 'templates/Reports/SchoolReportBoard';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function SchoolReportBoard() {
  return <>teste</>;

  // return <SchoolReportBoardTemplate />;
}

export const getServerSideProps = withProtectedRoute();

SchoolReportBoard.auth = {
  module: 'SCHOOL_REPORT'
};

export default SchoolReportBoard;
