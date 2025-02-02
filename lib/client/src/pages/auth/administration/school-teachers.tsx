import SchoolTeachers from 'templates/Administration/SchoolTeachers';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function SchoolTeachersPage() {
  return <SchoolTeachers />;
}

export const getServerSideProps = withProtectedRoute(() => {
  return {
    props: {}
  };
});

SchoolTeachersPage.auth = {
  module: 'SCHOOL_TEACHER'
};

export default SchoolTeachersPage;
