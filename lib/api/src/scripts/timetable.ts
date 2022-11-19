import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import Timetable from '@modules/schools/infra/typeorm/entities/Timetable';
import { waitDataSource, dataSource } from '../config/data_source';

const persist = async (timetable: Timetable): Promise<void> => {
  await waitDataSource;

  const timetableRepository = dataSource.getRepository(Timetable);
  const existent = await timetableRepository.findOne({
    where: { id: timetable.id },
  });
  if (existent) {
    const newTimetable = Object.assign(existent, timetable);
    await timetableRepository.save(newTimetable);

    console.log('updated', timetable.id);
  } else {
    const newTimetable = timetableRepository.create(timetable);
    await timetableRepository.save(newTimetable);

    console.log('created', timetable.id);
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
    '7. timetables.sql',
  );

  const parser = parse(
    { columns: true, delimiter: ',' },
    async function onResult(err, records: Timetable[]) {
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
      }) as Timetable[];

      // console.log(mappedItems);
      await Promise.all(mappedItems.map(persist));
    },
  );

  fs.createReadStream(filePath).pipe(parser);
};

run();
