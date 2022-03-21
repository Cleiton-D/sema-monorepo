import { GetServerSidePropsContext } from 'next';

import SaveEmployee from 'templates/Administration/Employees/Save';

import protectedRoutes from 'utils/protected-routes';

function NewEmployeePage() {
  return <SaveEmployee />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return {
    props: {
      session
    }
  };
}

NewEmployeePage.auth = {
  module: 'EMPLOYEE',
  rule: 'WRITE'
};

export default NewEmployeePage;
