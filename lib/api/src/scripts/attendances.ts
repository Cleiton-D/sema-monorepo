import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import Attendance from '@modules/classes/infra/typeorm/entities/Attendance';
import { waitDataSource, dataSource } from '../config/data_source';

const errors = [];

const persist = async (attendance: Attendance): Promise<void> => {
  await waitDataSource;

  try {
    const attendanceRepository = dataSource.getRepository(Attendance);
    const existent = await attendanceRepository.findOne({
      where: { id: attendance.id },
    });
    if (existent) {
      const newAttendance = Object.assign(existent, attendance);
      await attendanceRepository.save(newAttendance);

      console.log('updated', attendance.id);
    } else {
      const newAttendance = attendanceRepository.create(attendance);
      await attendanceRepository.save(newAttendance);

      console.log('created', attendance.id);
    }
  } catch (err) {
    errors.push({ err, id: attendance.id });
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
    '11. attendances.sql',
  );

  const parser = parse(
    { columns: true, delimiter: ',' },
    async function onResult(err, records: Attendance[]) {
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
      }) as Attendance[];

      // console.log(mappedItems);
      await Promise.all(mappedItems.map(persist));
      console.log(errors);
    },
  );

  fs.createReadStream(filePath).pipe(parser);
};

run();
