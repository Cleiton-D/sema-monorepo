import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import Enroll from '@modules/enrolls/infra/typeorm/entities/Enroll';
import { waitDataSource, dataSource } from '../config/data_source';

const persist = async (enroll: Enroll): Promise<void> => {
  await waitDataSource;

  const enrollRepository = dataSource.getRepository(Enroll);
  const existent = await enrollRepository.findOne({
    where: { id: enroll.id },
  });
  if (existent) {
    const newEnroll = Object.assign(existent, enroll);
    await enrollRepository.save(newEnroll);

    console.log('updated', enroll.id);
  } else {
    const newEnroll = enrollRepository.create(enroll);
    await enrollRepository.save(newEnroll);

    console.log('created', enroll.id);
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
    '5. enrolls.sql',
  );

  const parser = parse(
    { columns: true, delimiter: ',' },
    async function onResult(err, records: Enroll[]) {
      const mappedItems = records.map(item => {
        return Object.keys(item).reduce((acc, key) => {
          const value = item[key];

          if (value === 'undefined') {
            return { ...acc, [key]: undefined };
          }
          if (['NULL', 'null'].includes(value)) {
            return { ...acc, [key]: null };
          }

          return { ...acc, [key]: value };
        }, {});
      }) as Enroll[];

      await Promise.all(mappedItems.map(persist));
    },
  );

  fs.createReadStream(filePath).pipe(parser);
};

run();
