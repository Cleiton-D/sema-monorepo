import { NextApiHandler } from 'next';
import { decodeJwt } from 'jose';

import { AccessModule } from 'models/AccessModule';

import { createUnstableApi } from 'services/api';
import { withSessionRoute } from 'utils/session/withSession';

const getSchoolYearRoute: NextApiHandler = async (req, res) => {
  if (!req.session.token) {
    return res.status(403).send({ error: 'unauthorized' });
  }

  console.log('Session token:', req.session.token);
  const decoded = decodeJwt(req.session.token) as {
    pfl: string;
    sub: string;
    scy?: string;
  };

  console.log('Decoded token:', decoded);
  console.log('scy:', decoded.scy);

  const api = createUnstableApi(req.session);
  const schoolYear = await api
    .get<AccessModule[]>(`/education/admin/school-years/${decoded.scy || 'current'}`)
    .then((response) => response.data);

  res.send(schoolYear);
};

export default withSessionRoute(getSchoolYearRoute);
