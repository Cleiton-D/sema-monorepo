import { GetServerSidePropsContext } from 'next';

import Employees from 'templates/Administration/Employees';

import protectedRoutes from 'utils/protected-routes';

function EmployeesPage() {
  return <Employees />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return {
    props: {
      session
    }
  };
}

EmployeesPage.auth = {
  module: 'EMPLOYEE'
};

export default EmployeesPage;
