import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import Student from '@modules/students/infra/typeorm/entities/Student';
import { waitDataSource, dataSource } from '../config/data_source';

const persist = async (student: Student): Promise<void> => {
  await waitDataSource;

  const studentRepository = dataSource.getRepository(Student);
  const existent = await studentRepository.findOne({
    where: { id: student.id },
  });
  if (existent) {
    const newStudent = Object.assign(existent, student);
    await studentRepository.save(newStudent);

    console.log('updated', student.id);
  } else {
    const newStudent = studentRepository.create(student);
    await studentRepository.save(newStudent);

    console.log('created', student.id);
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
    '3. students.sql',
  );

  const parser = parse(
    { columns: true, delimiter: ',' },
    async function onResult(err, records: Student[]) {
      await Promise.all(records.map(persist));
    },
  );

  fs.createReadStream(filePath).pipe(parser);
};

run();
