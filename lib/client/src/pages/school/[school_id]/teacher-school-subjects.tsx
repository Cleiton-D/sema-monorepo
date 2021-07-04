import { GetServerSidePropsContext } from 'next';

import TeacherSchoolSubjects, {
  TeacherSchoolSubjectsProps
} from 'templates/TeacherSchoolSubjects';

import { getSchool } from 'requests/queries/schools';
import { listClassrooms } from 'requests/queries/classrooms';

import protectedRoutes from 'utils/protected-routes';
import prefetchQuery from 'utils/prefetch-query';

function TeacherSchoolSubjectsPage(props: TeacherSchoolSubjectsProps) {
  return <TeacherSchoolSubjects {...props} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context);

  const { school_id } = context.params!;

  const school = await getSchool(session, { id: school_id as string });

  const filters = {
    school_id: school.id
  };

  const dehydratedState = await prefetchQuery({
    key: `list-classrooms-${JSON.stringify(filters)}`,
    fetcher: () => listClassrooms(session, filters)
  });

  return {
    props: {
      session,
      dehydratedState,
      school
    }
  };
}

TeacherSchoolSubjectsPage.auth = {
  module: 'TEACHER_SCHOOL_SUBJECT'
};

export default TeacherSchoolSubjectsPage;
