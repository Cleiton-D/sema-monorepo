import { GetServerSidePropsContext } from 'next';

import NewEnroll, { NewEnrollProps } from 'templates/Enrolls/New';

import { getSchool } from 'requests/queries/schools';

import protectedRoutes from 'utils/protected-routes';

import ufs from 'assets/data/uf.json';

function NewEnrollPage(props: NewEnrollProps) {
  return <NewEnroll {...props} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { school_id } = context.query || {};

  const school = await getSchool(session, { id: school_id as string });

  return {
    props: {
      session,
      school,
      ufs
    }
  };
}

NewEnrollPage.auth = {
  module: 'ENROLL',
  rule: 'WRITE'
};

export default NewEnrollPage;
