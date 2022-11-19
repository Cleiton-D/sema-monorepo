import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import Address from '@modules/address/infra/typeorm/entities/Address';
import { waitDataSource, dataSource } from '../config/data_source';

const persist = async (address: Address): Promise<void> => {
  await waitDataSource;

  const addressRepository = dataSource.getRepository(Address);
  const existent = await addressRepository.findOne({
    where: { id: address.id },
  });
  if (existent) {
    const newAddress = Object.assign(existent, address);
    await addressRepository.save(newAddress);

    console.log('updated', address.id);
  } else {
    const newAddress = addressRepository.create(address);
    await addressRepository.save(newAddress);

    console.log('created', address.id);
  }
};

const run = async () => {
  const filePath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'alteracoes',
    '1. address.sql',
  );

  const parser = parse(
    { columns: true, delimiter: ',' },
    async function onResult(err, records: Address[]) {
      await Promise.all(records.map(persist));
    },
  );

  fs.createReadStream(filePath).pipe(parser);
};

run();
