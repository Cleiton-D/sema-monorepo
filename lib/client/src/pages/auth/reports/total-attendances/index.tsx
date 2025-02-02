import TotalAttendancesTemplate from 'templates/Reports/TotalAttendances';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function TotalAttendances() {
  return <TotalAttendancesTemplate />;
}

export const getServerSideProps = withProtectedRoute();

TotalAttendances.auth = {
  module: 'SCHOOL_REPORT'
};

export default TotalAttendances;
