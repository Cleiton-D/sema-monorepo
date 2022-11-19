import {
  DataSource,
  DataSourceOptions as TypeORMConnectionOptions,
} from 'typeorm';

import { dataSource, waitDataSource } from '@config/data_source';

type ConnectionOptions = TypeORMConnectionOptions & {
  seeds?: string[];
  cli?: {
    migrationsDir: string;
    seedsDir: string;
  };
};

async function migrations(): Promise<void> {
  await waitDataSource;

  const options: ConnectionOptions = { ...dataSource.options };

  const newOptions: TypeORMConnectionOptions = {
    ...options,
    migrations: [...(options.migrations as string[]), ...(options.seeds || [])],
  };

  const migrationsDataSource = new DataSource(newOptions);
  await migrationsDataSource.initialize();
  await migrationsDataSource.runMigrations({ transaction: 'each' });
  await migrationsDataSource.destroy();
}

async function seeds(): Promise<void> {
  await waitDataSource;

  const options: ConnectionOptions = { ...dataSource.options };

  const newOptions = {
    ...options,
    migrations: options.seeds,
    cli: { ...options.cli, migrationsDir: options.cli?.seedsDir },
  };

  const seedsDataSource = new DataSource(newOptions);

  await seedsDataSource.initialize();
  await seedsDataSource.runMigrations({ transaction: 'each' });
  await seedsDataSource.destroy();

  console.log('seeds finished');
}

async function initDB() {
  await migrations();
  // await seeds();
}

initDB();
