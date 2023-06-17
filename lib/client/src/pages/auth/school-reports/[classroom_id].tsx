import ClassroomSchoolReport from 'templates/ClassroomSchoolReport';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function ClassroomSchoolReportPage() {
  return <ClassroomSchoolReport />;
}

export const getServerSideProps = withProtectedRoute();

ClassroomSchoolReportPage.auth = {
  module: 'SCHOOL_REPORT'
};

export default ClassroomSchoolReportPage;
