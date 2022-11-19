import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import EnrollClassroom from '@modules/enrolls/infra/typeorm/entities/EnrollClassroom';
import { waitDataSource, dataSource } from '../config/data_source';

const persist = async (enrollClassroom: EnrollClassroom): Promise<void> => {
  await waitDataSource;

  const enrollClassroomRepository = dataSource.getRepository(EnrollClassroom);
  const existent = await enrollClassroomRepository.findOne({
    where: { id: enrollClassroom.id },
  });
  if (existent) {
    const newEnroll = Object.assign(existent, enrollClassroom);
    await enrollClassroomRepository.save(newEnroll);

    console.log('updated', enrollClassroom.id);
  } else {
    const newEnroll = enrollClassroomRepository.create(enrollClassroom);
    await enrollClassroomRepository.save(newEnroll);

    console.log('created', enrollClassroom.id);
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
    '6. enroll_classrooms.sql',
  );

  const parser = parse(
    { columns: true, delimiter: ',' },
    async function onResult(err, records: EnrollClassroom[]) {
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
      }) as EnrollClassroom[];

      // console.log(mappedItems);
      await Promise.all(mappedItems.map(persist));
    },
  );

  fs.createReadStream(filePath).pipe(parser);
};

run();
