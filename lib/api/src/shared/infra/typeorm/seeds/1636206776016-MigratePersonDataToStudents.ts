import { MigrationInterface, QueryRunner } from 'typeorm';

type PersonRaw = {
  enroll_id: string;
  person_id: string;
  name: string;
  mother_name?: string;
  dad_name?: string;
  gender?: string;
  address_id: string;
  birth_date?: string;
};

type DocumentsRaw = {
  document_type: string;
  document_number: string;
  person_id: string;
};

type ContactRaw = {
  contact_id: string;
  person_id: string;
};

export default class MigratePersonDataToStudents1636206776016
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const persons: PersonRaw[] = await queryRunner.query(`
          SELECT enroll.id AS enroll_id,
                 person.id AS person_id,
                 person.name AS name,
                 person.mother_name AS mother_name,
                 person.dad_name AS dad_name,
                 person.gender AS gender,
                 person.address_id AS address_id,
                 person.birth_date AS birth_date
            FROM enrolls AS enroll
      INNER JOIN persons AS person ON (person.id = enroll.person_id)
    `);

    if (persons.length > 0) {
      const personsIds = persons
        .map(person => `'${person.person_id}'`)
        .join(',');

      const documents: DocumentsRaw[] = await queryRunner.query(`
        SELECT document_type,
               document_number,
               person_id
          FROM person_documents
        WHERE person_id IN (${personsIds})
      `);
      const contacts: ContactRaw[] = await queryRunner.query(`
        SELECT contact_id,
              person_id
          FROM person_contacts
        WHERE person_id IN (${personsIds})
      `);

      const groupedPersons = persons.map(person => {
        const docs = documents.filter(
          doc => doc.person_id === person.person_id,
        );
        const personContacts = contacts.filter(
          contact => contact.person_id === person.person_id,
        );

        return {
          ...person,
          documents: docs,
          contacts: personContacts,
        };
      });

      const promises = groupedPersons.map(item => {
        const cpf = item.documents.find(
          ({ document_type }) => document_type === 'CPF',
        );
        const rg = item.documents.find(
          ({ document_type }) => document_type === 'RG',
        );

        const studentQuery = `
          insert_student AS (
            INSERT INTO "students"("name", "mother_name", "dad_name", "gender", "address_id", "birth_date", "cpf", "rg")
                 VALUES ($2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id as student_id
          )
        `;

        const contactsQuery = item.contacts.map((_, index) => {
          const str = `((SELECT "student_id" FROM "insert_student"), $${
            index + 10
          })`;
          if (index === 0) return str;

          return `,${str}`;
        });

        const enrollQuery = `
          UPDATE "enrolls"
             SET "student_id" = (SELECT "student_id" FROM "insert_student")
           WHERE "id" = $1
        `;

        const params = [
          item.enroll_id || null,
          item.name || null,
          item.mother_name || null,
          item.dad_name || null,
          item.gender || null,
          item.address_id || null,
          item.birth_date || null,
          cpf?.document_number || null,
          rg?.document_number || null,
        ];

        if (item.contacts.length > 0) {
          const withContactsQuery = `
            WITH ${studentQuery},
                 insert_contacts AS (
                    INSERT INTO "student_contacts"("student_id", "contact_id")
                         VALUES ${contactsQuery}
                    RETURNING *
                 )
            ${enrollQuery}
          `;

          const contactIds = item.contacts.map(
            ({ contact_id }) => contact_id || null,
          );

          const newParams = [...params, ...contactIds];
          return queryRunner.query(withContactsQuery, newParams);
        }

        const finalQuery = `
          WITH ${studentQuery}
          ${enrollQuery}
        `;

        return queryRunner.query(finalQuery, params);
      });

      await Promise.all(promises);
    }

    await queryRunner.dropForeignKey('enrolls', 'EnrollPerson');
    await queryRunner.dropColumn('enrolls', 'person_id');
  }

  public async down(): Promise<void> {
    console.log('reverting');
  }
}
