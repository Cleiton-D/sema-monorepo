import { getRepository, Repository, Raw } from 'typeorm';

import ITeachersRepository from '@modules/teachers/repositories/ITeachersRepository';
import Employee from '@modules/employees/infra/typeorm/entities/Employee';

class TeachersRepository implements ITeachersRepository {
  private ormRepository: Repository<Employee>;

  constructor() {
    this.ormRepository = getRepository(Employee);
  }

  public async findAll(): Promise<Employee[]> {
    const schoolTeachers = await this.ormRepository.find({
      where: {
        id: Raw(alias => {
          return `
            EXISTS (
              SELECT 1
                FROM "school_teachers" AS "school_teacher"
               WHERE "school_teacher"."employee_id" = ${alias}
            )
          `;
        }),
      },
    });

    return schoolTeachers;
  }
}

export default TeachersRepository;
