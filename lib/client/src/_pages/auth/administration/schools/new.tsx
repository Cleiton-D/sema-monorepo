// import NewSchool from 'templates/Administration/Schools/NewSchool';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function NewSchoolPage() {
  return <>teste</>;

  // return <NewSchool />;
}

export const getServerSideProps = withProtectedRoute(() => {
  return {
    props: {}
  };
});

NewSchoolPage.auth = {
  module: 'SCHOOL',
  rule: 'WRITE'
};

export default NewSchoolPage;
