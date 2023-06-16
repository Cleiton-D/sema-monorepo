import { User } from 'models/User';
import { NextApiHandler } from 'next';

import { createUnstableApi } from 'services/api';
import { withSessionRoute } from 'utils/session/withSession';

const getUserRoute: NextApiHandler = async (req, res) => {
  if (!req.session.token) {
    return res.status(403).send({ error: 'unauthorized' });
  }

  const api = createUnstableApi(req.session);
  const [user, employee] = await Promise.all([
    api.get<User>('/users/me').then((res) => res.data),
    api
      .get('/employees/me')
      .then((response) => response.data)
      .catch(() => undefined)
  ]);

  res.send({ ...user, employee });
};

export default withSessionRoute(getUserRoute);
