// import BackgroundsTemplate from 'templates/Backgrounds';

import { withProtectedRoute } from 'utils/session/withProtectedRoute';

function Backgrounds() {
  return <>teste</>;

  // return <BackgroundsTemplate />;
}

export const getServerSideProps = withProtectedRoute();

export default Backgrounds;
