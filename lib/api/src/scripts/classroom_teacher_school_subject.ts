import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import ClassroomTeacherSchoolSubject from '@modules/schools/infra/typeorm/entities/ClassroomTeacherSchoolSubject';
import { waitDataSource, dataSource } from '../config/data_source';

const persist = async (
  classroomTeacherSchoolSubject: ClassroomTeacherSchoolSubject,
): Promise<void> => {
  await waitDataSource;

  const classroomTeacherSchoolSubjectRepository = dataSource.getRepository(
    ClassroomTeacherSchoolSubject,
  );
  const existent = await classroomTeacherSchoolSubjectRepository.findOne({
    where: { id: classroomTeacherSchoolSubject.id },
  });
  if (existent) {
    const newClassroomTeacherSchoolSubject = Object.assign(
      existent,
      classroomTeacherSchoolSubject,
    );
    await classroomTeacherSchoolSubjectRepository.save(
      newClassroomTeacherSchoolSubject,
    );

    console.log('updated', classroomTeacherSchoolSubject.id);
  } else {
    const newClassroomTeacherSchoolSubject =
      classroomTeacherSchoolSubjectRepository.create(
        classroomTeacherSchoolSubject,
      );
    await classroomTeacherSchoolSubjectRepository.save(
      newClassroomTeacherSchoolSubject,
    );

    console.log('created', classroomTeacherSchoolSubject.id);
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
    '8. classroom_teacher_school_subjects.sql',
  );

  const parser = parse(
    { columns: true, delimiter: ',' },
    async function onResult(err, records: ClassroomTeacherSchoolSubject[]) {
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
      }) as ClassroomTeacherSchoolSubject[];

      // console.log(mappedItems);
      await Promise.all(mappedItems.map(persist));
    },
  );

  fs.createReadStream(filePath).pipe(parser);
};

run();
