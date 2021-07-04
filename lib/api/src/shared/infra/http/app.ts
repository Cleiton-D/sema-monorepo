import 'reflect-metadata';

import '../../container';
import server from './server';

import '@shared/infra/typeorm';

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log(`🚀server online on port ${port}`);
});
