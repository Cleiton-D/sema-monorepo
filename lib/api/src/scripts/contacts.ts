import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

import Contact from '@modules/contacts/infra/typeorm/entities/Contact';
import { waitDataSource, dataSource } from '../config/data_source';

const persist = async (contact: Contact): Promise<void> => {
  await waitDataSource;

  const contactRepository = dataSource.getRepository(Contact);
  const existent = await contactRepository.findOne({
    where: { id: contact.id },
  });
  if (existent) {
    const newContact = Object.assign(existent, contact);
    await contactRepository.save(newContact);

    console.log('updated', contact.id);
  } else {
    const newContact = contactRepository.create(contact);
    await contactRepository.save(newContact);

    console.log('created', contact.id);
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
    '2. contacts.sql',
  );

  const parser = parse(
    { columns: true, delimiter: ',' },
    async function onResult(err, records: Contact[]) {
      await Promise.all(records.map(persist));
    },
  );

  fs.createReadStream(filePath).pipe(parser);
};

run();
