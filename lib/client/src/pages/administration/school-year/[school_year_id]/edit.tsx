import { GetServerSidePropsContext } from 'next';

import NewSchoolYear from 'templates/Administration/SchoolYear/NewSchoolYear';

import protectedRoutes from 'utils/protected-routes';
import { storeServerAtom } from 'hooks/AtomProvider';

import { getSchoolYearWithSchoolTerms } from 'requests/queries/school-year';

function EditSchoolYearPage() {
  return <NewSchoolYear />;
}

type EditSchoolYearPageParams = {
  school_year_id: string;
};
export async function getServerSideProps(
  context: GetServerSidePropsContext<EditSchoolYearPageParams>
) {
  const session = await protectedRoutes(context);

  const { school_year_id } = context.params!;

  const response = await getSchoolYearWithSchoolTerms(session, {
    id: school_year_id
  });
  const { schoolTermPeriods, ...schoolYear } = response;
  if (schoolYear.status !== 'PENDING') {
    context.res.writeHead(302, {
      Location: '/administration/school-year'
    });
    context.res.end();
    return { props: { session } };
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
      session,
      initialState
    }
  };
}

EditSchoolYearPage.auth = {
  module: 'SCHOOL_YEAR'
};

export default EditSchoolYearPage;
