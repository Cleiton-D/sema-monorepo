import { GetServerSidePropsContext } from 'next';

import TotalAttendancesTemplate from 'templates/Reports/TotalAttendances';

import protectedRoutes from 'utils/protected-routes';

function TotalAttendances() {
  return <TotalAttendancesTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return {
    props: {
      session
    }
  };
}

TotalAttendances.auth = {
  module: 'SCHOOL_REPORT'
};

export default TotalAttendances;
