import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import StudentContact from '@modules/students/infra/typeorm/entities/StudentContact';
import { waitDataSource, dataSource } from '../config/data_source';

const persist = async (studentContact: StudentContact): Promise<void> => {
  await waitDataSource;

  const studentContactRepository = dataSource.getRepository(StudentContact);
  const existent = await studentContactRepository.findOne({
    where: { id: studentContact.id },
  });
  if (existent) {
    const newStudentContact = Object.assign(existent, studentContact);
    await studentContactRepository.save(newStudentContact);

    console.log('updated', studentContact.id);
  } else {
    const newStudentContact = studentContactRepository.create(studentContact);
    await studentContactRepository.save(newStudentContact);

    console.log('created', studentContact.id);
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
    '4. student-contacts.sql',
  );

  const parser = parse(
    { columns: true, delimiter: ',' },
    async function onResult(err, records: StudentContact[]) {
      await Promise.all(records.map(persist));
    },
  );

  fs.createReadStream(filePath).pipe(parser);
};

run();
