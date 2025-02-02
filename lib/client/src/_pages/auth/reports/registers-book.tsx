// import RegistersBookTemplate from 'templates/Reports/RegistersBook';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function RegistersBook() {
  return <>teste</>;

  // return <RegistersBookTemplate />;
}

export const getServerSideProps = withProtectedRoute();

RegistersBook.auth = {
  module: 'SCHOOL_REPORT'
};

export default RegistersBook;
