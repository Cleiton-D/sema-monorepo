// import ClassroomTemplate from 'templates/Classroom';
import { withProtectedRoute } from 'utils/session/withProtectedRoute';

const ClassroomPage = () => {
  return <>teste</>;

  // return <ClassroomTemplate />;
};

export const getServerSideProps = withProtectedRoute();

ClassroomPage.auth = {
  module: 'CLASSROOM'
};

export default ClassroomPage;
