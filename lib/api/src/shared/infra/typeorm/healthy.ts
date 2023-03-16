import { dataSource, waitDataSource } from '@config/data_source';

export default async function healthy(): Promise<boolean> {
  await waitDataSource;

  await dataSource.query(`SELECT 1`);
  return true;
}
