import { GetServerSidePropsContext } from 'next';

import EditStudentPageTemplate, {
  EditStudentPageTemplateProps
} from 'templates/EditStudent';

import { enrollsKeys, getEnrollDetails } from 'requests/queries/enrolls';
import { listSchoolReports } from 'requests/queries/school-reports';

import prefetchQuery from 'utils/prefetch-query';

import ufs from 'assets/data/uf.json';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function StudentPage(props: EditStudentPageTemplateProps) {
  return <EditStudentPageTemplate {...props} />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const { enroll_id } = context.params!;

    const filters = {
      enroll_id: enroll_id as string
    };

    const dehydratedState = await prefetchQuery([
      {
        key: enrollsKeys.show(enroll_id as string),
        fetcher: () =>
          getEnrollDetails(enroll_id as string, context.req.session)
      },
      {
        key: `list-school-reports-${JSON.stringify(filters)}`,
        fetcher: () => listSchoolReports(filters, context.req.session)
      }
    ]);

    return {
      props: {
        dehydratedState,
        ufs
      }
    };
  }
);

StudentPage.auth = {
  module: 'ENROLL'
};

export default StudentPage;
