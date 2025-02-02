// import ClassesTemplate from 'templates/Classes';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function ClassesPage() {
  return <>teste</>;

  // return <ClassesTemplate />;
}

export const getServerSideProps = withProtectedRoute();

ClassesPage.auth = {
  module: 'CLASS'
};

export default ClassesPage;
