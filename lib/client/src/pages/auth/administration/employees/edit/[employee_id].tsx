import { GetServerSidePropsContext } from 'next';
import { showEmployee } from 'requests/queries/employee';

import SaveEmployee from 'templates/Administration/Employees/Save';
import prefetchQuery from 'utils/prefetch-query';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function EditEmployeePage() {
  return <SaveEmployee />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const filters = {
      employee_id: context.query.employee_id as string
    };

    const dehydratedState = await prefetchQuery({
      key: `show-employee-${JSON.stringify(filters)}`,
      fetcher: () => showEmployee(filters, context.req.session)
    });

    return {
      props: {
        dehydratedState
      }
    };
  }
);
EditEmployeePage.auth = {
  module: 'EMPLOYEE',
  rule: 'WRITE'
};

export default EditEmployeePage;
