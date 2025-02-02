import { GetServerSidePropsContext } from 'next';

// import NewSchoolYear from 'templates/Administration/SchoolYear/NewSchoolYear';

import { storeServerAtom } from 'hooks/AtomProvider';

import { getSchoolYearWithSchoolTerms } from 'requests/queries/school-year';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function EditSchoolYearPage() {
  return <>teste</>;

  // return <NewSchoolYear />;
}

export const getServerSideProps = withProtectedRoute(
  async (context: GetServerSidePropsContext) => {
    const { school_year_id } = context.params!;

    const response = await getSchoolYearWithSchoolTerms(
      {
        id: school_year_id as string
      },
      context.req.session
    );
    const { schoolTermPeriods, ...schoolYear } = response;
    if (schoolYear.status !== 'PENDING') {
      context.res.writeHead(302, {
        Location: '/administration/school-year'
      });
      context.res.end();

      return { props: {} };
    }

    const atomValue = {
      schoolYear,
      schoolTermPeriods: Object.values(schoolTermPeriods)
    };
    const initialState = storeServerAtom(
      context,
      'create-school-year',
      atomValue
    );

    return {
      props: {
        initialState
      }
    };
  }
);

EditSchoolYearPage.auth = {
  module: 'SCHOOL_YEAR',
  rule: 'WRITE'
};

export default EditSchoolYearPage;
