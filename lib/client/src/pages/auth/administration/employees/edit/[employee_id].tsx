import { GetServerSidePropsContext } from 'next';
import { showEmployee } from 'requests/queries/employee';

import SaveEmployee from 'templates/Administration/Employees/Save';
import prefetchQuery from 'utils/prefetch-query';

import protectedRoutes from 'utils/protected-routes';

function EditEmployeePage() {
  return <SaveEmployee />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const filters = {
    employee_id: context.query.employee_id as string
  };

  const dehydratedState = await prefetchQuery({
    key: `show-employee-${JSON.stringify(filters)}`,
    fetcher: () => showEmployee(session, filters)
  });

  return {
    props: {
      session,
      dehydratedState
    }
  };
}

EditEmployeePage.auth = {
  module: 'EMPLOYEE',
  rule: 'WRITE'
};

export default EditEmployeePage;
