import { NextApiHandler } from 'next';
import { decode } from 'jsonwebtoken';

import { AccessModule } from 'models/AccessModule';

import { createUnstableApi } from 'services/api';
import { withSessionRoute } from 'utils/session/withSession';

const getSchoolYearRoute: NextApiHandler = async (req, res) => {
  if (!req.session.token) {
    return res.status(403).send({ error: 'unauthorized' });
  }

  const { scy } = decode(req.session.token) as {
    pfl: string;
    sub: string;
    scy?: string;
  };

  console.log('Decoded token:', { scy });

  const api = createUnstableApi(req.session);
  const schoolYear = await api
    .get<AccessModule[]>(`/education/admin/school-years/${scy || 'current'}`)
    .then((response) => response.data);

  res.send(schoolYear);
};

export default withSessionRoute(getSchoolYearRoute);
