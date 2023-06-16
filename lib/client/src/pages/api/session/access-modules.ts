import { NextApiHandler } from 'next';

import { AccessModule } from 'models/AccessModule';

import { createUnstableApi } from 'services/api';
import { withSessionRoute } from 'utils/session/withSession';

const getAccessModulesRoute: NextApiHandler = async (req, res) => {
  if (!req.session.token) {
    return res.status(403).send({ error: 'unauthorized' });
  }

  const api = createUnstableApi(req.session);
  const accessModules = await api
    .get<AccessModule[]>('/app/access-modules/mine')
    .then(({ data: accessModules }) =>
      accessModules
        .filter(({ read, write }) => read || write)
        .map(({ write, app_module }) => {
          const access_level = write ? 'WRITE' : 'READ';

          return {
            access_level,
            app_module: app_module.description
          };
        })
    );

  res.send(accessModules);
};

export default withSessionRoute(getAccessModulesRoute);
