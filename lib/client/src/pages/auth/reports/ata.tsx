import AtaTemplate from 'templates/Reports/Ata';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function Ata() {
  return <AtaTemplate />;
}

export const getServerSideProps = withProtectedRoute();

Ata.auth = {
  module: 'SCHOOL_REPORT'
};

export default Ata;
