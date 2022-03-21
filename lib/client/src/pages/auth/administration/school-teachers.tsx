import { GetServerSidePropsContext } from 'next';

import SchoolTeachers from 'templates/Administration/SchoolTeachers';

import protectedRoutes from 'utils/protected-routes';

function SchoolTeachersPage() {
  return <SchoolTeachers />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  return {
    props: {
      session
    }
  };
}

SchoolTeachersPage.auth = {
  module: 'SCHOOL_TEACHER'
};

export default SchoolTeachersPage;
