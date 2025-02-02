// import SaveEmployee from 'templates/Administration/Employees/Save';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function NewEmployeePage() {
  return <>teste</>;

  // return <SaveEmployee />;
}

export const getServerSideProps = withProtectedRoute(() => {
  return {
    props: {}
  };
});

NewEmployeePage.auth = {
  module: 'EMPLOYEE',
  rule: 'WRITE'
};

export default NewEmployeePage;
