import {
  getRepository,
  MigrationInterface,
  QueryRunner,
  Repository,
} from 'typeorm';

import Employee from '@modules/employees/infra/typeorm/entities/Employee';

type EmployeeRaw = {
  id: string;
  person_id: string;
};

type PersonRaw = {
  id: string;
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

type EmployeeMap = Record<string, Employee>;

export default class MigratePersonDataToEmployee1634043154318
  implements MigrationInterface {
  private employeesRepository: Repository<Employee>;

  constructor() {
    this.employeesRepository = getRepository(Employee);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const employees = await this.employeesRepository.find();

    const employeesRaw: EmployeeRaw[] = await queryRunner.query(`
      SELECT id, person_id from employees where deleted_at IS NULL
    `);

    const employeesMap = employees.reduce<EmployeeMap>((acc, employee) => {
      return { ...acc, [employee.id]: employee };
    }, {});

    const personsIdsMap = employeesRaw.reduce<EmployeeMap>((acc, item) => {
      return {
        ...acc,
        [item.person_id]: employeesMap[item.id],
      };
    }, {});

    if (Object.keys(personsIdsMap).length > 0) {
      const personIdsStr = Object.keys(personsIdsMap)
        .map(personId => `'${personId}'`)
        .join(',');

      const persons: PersonRaw[] = await queryRunner.query(
        `SELECT id,
                name,
                mother_name,
                dad_name,
                gender,
                address_id,
                birth_date
           FROM persons
          WHERE id IN (${personIdsStr})`,
      );
      const documents: DocumentsRaw[] = await queryRunner.query(`
      SELECT document_type,
             document_number,
             person_id
        FROM person_documents
       WHERE person_id IN (${personIdsStr})
    `);
      const contacts: ContactRaw[] = await queryRunner.query(`
      SELECT contact_id,
             person_id
        FROM person_contacts
       WHERE person_id IN (${personIdsStr})
    `);

      const groupedPersons = persons.map(person => {
        const docs = documents.filter(doc => doc.person_id === person.id);
        const personContacts = contacts.filter(
          contact => contact.person_id === person.id,
        );

        return {
          ...person,
          documents: docs,
          contacts: personContacts,
        };
      });

      const newEmployees = groupedPersons.map(person => {
        const employee = personsIdsMap[person.id];

        const cpf = person.documents.find(
          ({ document_type }) => document_type === 'CPF',
        );
        const rg = person.documents.find(
          ({ document_type }) => document_type === 'RG',
        );

        const employeeContacts = person.contacts.map(({ contact_id }) => ({
          contact_id,
        }));

        return Object.assign(employee, {
          name: person.name,
          mother_name: person.mother_name,
          dad_name: person.dad_name,
          gender: person.gender,
          address_id: person.address_id,
          birth_date: person.birth_date,
          cpf: cpf?.document_number,
          rg: rg?.document_number,
          employee_contacts: employeeContacts,
        });
      });

      await this.employeesRepository.save(newEmployees);
    }

    await queryRunner.dropForeignKey('employees', 'EmployeePersons');
    await queryRunner.dropColumn('employees', 'person_id');
  }

  public async down(): Promise<void> {
    console.log('reverting');
  }
}
