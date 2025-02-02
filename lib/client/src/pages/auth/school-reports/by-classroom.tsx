// import SchoolReportsByClassroomTemplate from 'templates/SchoolReportsByClassroom';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function SchoolReportsByClassroomPage() {
  return <>teste</>;

  // return <SchoolReportsByClassroomTemplate />;
}

export const getServerSideProps = withProtectedRoute();

SchoolReportsByClassroomPage.auth = {
  module: 'SCHOOL_REPORT'
};

export default SchoolReportsByClassroomPage;
