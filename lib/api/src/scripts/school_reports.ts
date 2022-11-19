import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import SchoolReport from '@modules/enrolls/infra/typeorm/entities/SchoolReport';
import { waitDataSource, dataSource } from '../config/data_source';

const errors = [];

const persist = async (schoolReport: SchoolReport): Promise<void> => {
  await waitDataSource;

  try {
    const schoolReportRepository = dataSource.getRepository(SchoolReport);
    const existent = await schoolReportRepository.findOne({
      where: { id: schoolReport.id },
    });
    if (existent) {
      const newSchoolReport = Object.assign(existent, schoolReport);
      await schoolReportRepository.save(newSchoolReport);

      console.log('updated', schoolReport.id);
    } else {
      const newSchoolReport = schoolReportRepository.create(schoolReport);
      await schoolReportRepository.save(newSchoolReport);

      console.log('created', schoolReport.id);
    }
  } catch (err) {
    errors.push({ err, id: schoolReport.id });
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
    '12. school_reports.sql',
  );

  const parser = parse(
    { columns: true, delimiter: ',' },
    async function onResult(err, records: SchoolReport[]) {
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
      }) as SchoolReport[];

      // console.log(mappedItems);
      await Promise.all(mappedItems.map(persist));
      console.log(errors);
    },
  );

  fs.createReadStream(filePath).pipe(parser);
};

run();
