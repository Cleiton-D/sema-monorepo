import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import CalendarEvent from '@modules/education_core/infra/typeorm/entities/CalendarEvent';
import { waitDataSource, dataSource } from '../config/data_source';

const persist = async (calendarEvent: CalendarEvent): Promise<void> => {
  await waitDataSource;

  const calendarEventRepository = dataSource.getRepository(CalendarEvent);
  const existent = await calendarEventRepository.findOne({
    where: { id: calendarEvent.id },
  });
  if (existent) {
    const newCalendarEvent = Object.assign(existent, calendarEvent);
    await calendarEventRepository.save(newCalendarEvent);

    console.log('updated', calendarEvent.id);
  } else {
    const newCalendarEvent = calendarEventRepository.create(calendarEvent);
    await calendarEventRepository.save(newCalendarEvent);

    console.log('created', calendarEvent.id);
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
    '9. calendar_events.sql',
  );

  const parser = parse(
    { columns: true, delimiter: ',' },
    async function onResult(err, records: CalendarEvent[]) {
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
      }) as CalendarEvent[];

      // console.log(mappedItems);
      await Promise.all(mappedItems.map(persist));
    },
  );

  fs.createReadStream(filePath).pipe(parser);
};

run();
