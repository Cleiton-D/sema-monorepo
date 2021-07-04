import {
  FindConditions,
  getRepository,
  Repository,
  WhereExpression,
} from 'typeorm';

import CreateEmployeeDTO from '@modules/employees/dtos/CreateEmployeeDTO';
import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import FindEmployeeDTO from '@modules/employees/dtos/FindEmployeesDTO';
import CountResultDTO from '@modules/employees/dtos/CountResultDTO';
import Employee from '../entities/Employee';

export default class EmployeesRepository implements IEmployeesRepository {
  private ormRepository: Repository<Employee>;

  constructor() {
    this.ormRepository = getRepository(Employee);
  }

  private mountAccessQuery(
    { accessCode, branch }: Pick<FindEmployeeDTO, 'accessCode' | 'branch'>,
    tableAlias: string,
  ) {
    const query = /* sql */ `
      SELECT 1 FROM user_profiles user_profile
        JOIN access_levels access_level ON (access_level.id = user_profile.access_level_id)
       WHERE user_profile.user_id = "${tableAlias}"."user_id"
      ${accessCode ? 'AND access_level.code = :accessCode' : ''}
      ${branch ? 'AND user_profile.branch_id = :branchId' : ''}
    `;

    return {
      query: `EXISTS (${query})`,
      parameters: {
        accessCode,
        branchId: branch,
      },
    };
  }

  public async findOne({
    id,
    person_id,
    user_id,
    pis_pasep,
    education_level,
    accessCode,
    branch,
  }: FindEmployeeDTO): Promise<Employee | undefined> {
    const where: FindConditions<Employee> = {};
    if (id) where.id = id;
    if (person_id) where.person_id = person_id;
    if (user_id) where.user_id = user_id;
    if (pis_pasep) where.pis_pasep = pis_pasep;
    if (education_level) where.education_level = education_level;

    const employee = await this.ormRepository.findOne({
      join: {
        alias: 'employee',
        leftJoinAndSelect: {
          person: 'employee.person',
          person_contacts: 'person.person_contacts',
          person_contacts_contact: 'person_contacts.contact',
          person_address: 'person.address',
        },
      },
      where: (qb: WhereExpression) => {
        qb.where(where);

        if (accessCode || branch) {
          const { query, parameters } = this.mountAccessQuery(
            {
              accessCode,
              branch,
            },
            'employee',
          );
          qb.andWhere(query, parameters);
        }
      },
    });
    return employee;
  }

  public async findAll({
    id,
    person_id,
    user_id,
    pis_pasep,
    education_level,
    accessCode,
    branch,
  }: FindEmployeeDTO): Promise<Employee[]> {
    const where: FindConditions<Employee> = {};
    if (id) where.id = id;
    if (person_id) where.person_id = person_id;
    if (user_id) where.user_id = user_id;
    if (pis_pasep) where.pis_pasep = pis_pasep;
    if (education_level) where.education_level = education_level;

    const employees = await this.ormRepository.find({
      join: {
        alias: 'employee',
        leftJoinAndSelect: {
          person: 'employee.person',
          person_contacts: 'person.person_contacts',
          person_contacts_contact: 'person_contacts.contact',
          person_address: 'person.address',
        },
      },
      where: (qb: WhereExpression) => {
        qb.where(where);

        if (accessCode || branch) {
          const { query, parameters } = this.mountAccessQuery(
            {
              accessCode,
              branch,
            },
            'employee',
          );
          qb.andWhere(query, parameters);
        }
      },
    });
    return employees;
  }

  public async count(): Promise<CountResultDTO> {
    const count = await this.ormRepository.count();
    return { count };
  }

  public async create({
    person,
    user,
    pis_pasep,
    education_level,
  }: CreateEmployeeDTO): Promise<Employee> {
    const employee = this.ormRepository.create({
      person,
      user,
      pis_pasep,
      education_level,
    });
    await this.ormRepository.save(employee);
    return employee;
  }

  public async update(employee: Employee): Promise<Employee> {
    await this.ormRepository.save(employee);
    return employee;
  }
}
