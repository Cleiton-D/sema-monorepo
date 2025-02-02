import { School } from 'models/School';
import { UserProfile } from 'models/UserProfile';
import { NextApiHandler } from 'next';

import { createUnstableApi } from 'services/api';
import { withSessionRoute } from 'utils/session/withSession';

const getUserRoute: NextApiHandler = async (req, res) => {
  if (!req.session.token) {
    return res.status(403).send({ error: 'unauthorized' });
  }

  const api = createUnstableApi(req.session);
  const [userProfile, school] = await Promise.all([
    api.get<UserProfile>('/user-profiles/me').then((res) => res.data),
    api
      .get<School>('/schools/me')
      .then((response) => response.data)
      .catch(() => undefined)
  ]);

  res.send({ ...userProfile, school });
};

export default withSessionRoute(getUserRoute);
