import { GetServerSidePropsContext } from 'next';

import AtaTemplate from 'templates/Reports/Ata';

import protectedRoutes from 'utils/protected-routes';

function Ata() {
  return <AtaTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return {
    props: {
      session
    }
  };
}

Ata.auth = {
  module: 'SCHOOL_REPORT'
};

export default Ata;
