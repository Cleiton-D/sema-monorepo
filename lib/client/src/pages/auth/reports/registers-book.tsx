import { GetServerSidePropsContext } from 'next';

import RegistersBookTemplate from 'templates/Reports/RegistersBook';

import protectedRoutes from 'utils/protected-routes';

function RegistersBook() {
  return <RegistersBookTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return {
    props: {
      session
    }
  };
}

RegistersBook.auth = {
  module: 'SCHOOL_REPORT'
};

export default RegistersBook;
