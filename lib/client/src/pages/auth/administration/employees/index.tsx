import Employees from 'templates/Administration/Employees';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function EmployeesPage() {
  return <Employees />;
}

export const getServerSideProps = withProtectedRoute(() => {
  return {
    props: {}
  };
});

EmployeesPage.auth = {
  module: 'EMPLOYEE'
};

export default EmployeesPage;
