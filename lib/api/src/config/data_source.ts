import { DataSource } from 'typeorm';

const entities_config =
  process.env.NODE_ENV === 'production'
    ? {
        entities: ['./dist/modules/**/infra/typeorm/entities/*.js'],
        migrations: ['./dist/shared/infra/typeorm/migrations/*.js'],
        seeds: ['./dist/shared/infra/typeorm/seeds/*.js'],
        cli: {
          migrationsDir: './dist/shared/infra/typeorm/migrations',
          seedsDir: './dist/shared/infra/typeorm/seeds',
        },
        // extra: {
        //   ssl: true,
        // },
      }
    : {
        entities: ['./src/modules/**/infra/typeorm/entities/*.ts'],
        migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
        seeds: ['./src/shared/infra/typeorm/seeds/*.ts'],
        cli: {
          migrationsDir: './src/shared/infra/typeorm/migrations',
          seedsDir: './src/shared/infra/typeorm/seeds',
        },
      };

const dataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  host: process.env.POSTGRES_HOST ?? '127.0.0.1',
  port: Number(process.env.POSTGRES_PORT) ?? 5432,
  username: process.env.POSTGRES_USERNAME ?? 'postgres',
  password: process.env.POSTGRES_PASSWORD ?? 'sema-dev',
  database: process.env.POSTGRES_DATABASE ?? 'diarioonline',
  ...entities_config,
});

const waitDataSource = dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch(err => {
    console.error('Error during Data Source initialization', err);
  });

export { dataSource, waitDataSource };
