import { GetServerSidePropsContext } from 'next';

import EditStudentPageTemplate, {
  EditStudentPageTemplateProps
} from 'templates/EditStudent';

import { enrollsKeys, getEnrollDetails } from 'requests/queries/enrolls';
import { listSchoolReports } from 'requests/queries/school-reports';

import prefetchQuery from 'utils/prefetch-query';
import protectedRoutes from 'utils/protected-routes';

import ufs from 'assets/data/uf.json';

function StudentPage(props: EditStudentPageTemplateProps) {
  return <EditStudentPageTemplate {...props} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { enroll_id } = context.params!;

  const filters = {
    enroll_id: enroll_id as string
  };

  const dehydratedState = await prefetchQuery([
    {
      key: enrollsKeys.show(enroll_id as string),
      fetcher: () => getEnrollDetails(enroll_id as string, session)
    },
    {
      key: `list-school-reports-${JSON.stringify(filters)}`,
      fetcher: () => listSchoolReports(session, filters)
    }
  ]);

  return {
    props: {
      session,
      dehydratedState,
      ufs
    }
  };
}

StudentPage.auth = {
  module: 'ENROLL'
};

export default StudentPage;
