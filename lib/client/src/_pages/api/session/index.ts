import { NextApiHandler } from 'next';
import { createUnstableApi } from 'services/api';

import { withSessionRoute } from 'utils/session/withSession';

const getSession: NextApiHandler = (req, res) => {
  if (!req.session.token) {
    return res.status(403).send({ error: 'unauthorized' });
  }

  res.send({ token: req.session.token });
};

const createSession: NextApiHandler = async (req, res) => {
  const { email, password } = req.body;

  const api = createUnstableApi();
  const response = await api.post(`/sessions`, {
    login: email,
    password
  });

  const { data } = response;
  req.session.token = data.token;
  await req.session.save();
  return res.send({ message: 'logged in' });
};

const refreshSession: NextApiHandler = async (req, res) => {
  const { profileId, schoolYearId } = req.body;

  const api = createUnstableApi(req.session);
  const response = await api.put(`/sessions`, {
    profile_id: profileId,
    school_year_id: schoolYearId
  });

  const { data } = response;
  req.session.token = data.token;
  await req.session.save();
  return res.send({ message: 'logged in' });
};

const destroySession: NextApiHandler = async (req, res) => {
  req.session.destroy();
  return res.send({ loggedout: true });
};

const sessionRoute: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') return getSession(req, res);
  if (req.method === 'POST') return createSession(req, res);
  if (req.method === 'PUT') return refreshSession(req, res);
  if (req.method === 'DELETE') return destroySession(req, res);

  return res.status(404).send({ error: 'not found' });
};

export default withSessionRoute(sessionRoute);
