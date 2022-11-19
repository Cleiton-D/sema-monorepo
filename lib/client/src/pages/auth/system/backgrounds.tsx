import { GetServerSidePropsContext } from 'next';

import BackgroundsTemplate from 'templates/Backgrounds';

import protectedRoutes from 'utils/protected-routes';

function Backgrounds() {
  return <BackgroundsTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return {
    props: {
      session
    }
  };
}

export default Backgrounds;
