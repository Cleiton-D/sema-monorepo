import {
  createConnection,
  getConnectionOptions,
  ConnectionOptions as TypeORMConnectionOptions,
} from 'typeorm';

type ConnectionOptions = TypeORMConnectionOptions & {
  seeds?: string[];
};

async function migrations(): Promise<void> {
  const options = await getConnectionOptions('default');

  const connection = await createConnection(options);
  await connection.runMigrations();
  await connection.close();
}

async function seeds(): Promise<void> {
  const options: ConnectionOptions = await getConnectionOptions('default');

  const newOptions = { ...options, migrations: options.seeds };

  const connection = await createConnection(newOptions);
  await connection.runMigrations();
  await connection.close();
}

async function initDB() {
  await migrations();
  await seeds();
}

initDB();
