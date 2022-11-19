import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import Class from '@modules/classes/infra/typeorm/entities/Class';
import { waitDataSource, dataSource } from '../config/data_source';

const persist = async (classEntity: Class): Promise<void> => {
  await waitDataSource;

  const classRepository = dataSource.getRepository(Class);
  const existent = await classRepository.findOne({
    where: { id: classEntity.id },
  });
  if (existent) {
    const newClass = Object.assign(existent, classEntity);
    await classRepository.save(newClass);

    console.log('updated', classEntity.id);
  } else {
    const newClass = classRepository.create(classEntity);
    await classRepository.save(newClass);

    console.log('created', classEntity.id);
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
    '10. classes.sql',
  );

  const parser = parse(
    { columns: true, delimiter: '$$|' },
    async function onResult(err, records: Class[]) {
      const mappedItems = records.map(item => {
        return Object.keys(item).reduce((acc, key) => {
          const value = item[key];

          if (value === 'undefined') {
            return { ...acc, [key]: undefined };
          }
          if (['NULL', 'null'].includes(value)) {
            return { ...acc, [key]: null };
          }
          if (value === 'true') {
            return { ...acc, [key]: true };
          }
          if (value === 'false') {
            return { ...acc, [key]: false };
          }

          return { ...acc, [key]: value };
        }, {});
      }) as Class[];

      // console.log(mappedItems);
      await Promise.all(mappedItems.map(persist));
    },
  );

  fs.createReadStream(filePath).pipe(parser);
};

run();
