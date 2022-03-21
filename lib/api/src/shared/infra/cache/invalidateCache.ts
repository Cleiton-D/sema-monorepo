import Redis from 'ioredis';

import cacheConfig from '@config/cache';

async function invalidate() {
  const client = new Redis(cacheConfig.config.redis);
  const keys = await client.keys('*');

  const pipeline = client.pipeline();
  pipeline.del(...keys);

  await pipeline.exec();
  client.disconnect();
}

invalidate();
