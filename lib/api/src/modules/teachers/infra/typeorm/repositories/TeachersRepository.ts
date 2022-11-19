import { Repository, ObjectLiteral } from 'typeorm';

import { dataSource } from '@config/data_source';

import ITeachersRepository from '@modules/teachers/repositories/ITeachersRepository';
import Employee from '@modules/employees/infra/typeorm/entities/Employee';
import FindTeacherDTO from '@modules/teachers/dtos/FindTeacherDTO';

type AndWhere = {
  condition: string;
  parameters?: ObjectLiteral;
};

class TeachersRepository implements ITeachersRepository {
  private ormRepository: Repository<Employee>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Employee);
  }

  public async findAll({ school_id }: FindTeacherDTO): Promise<Employee[]> {
    const andWhere: AndWhere[] = [];

    if (school_id) {
      andWhere.push({
        condition: 'school_teacher.school_id = :schoolId',
        parameters: { schoolId: school_id },
      });
    }

    const queryBuilder = this.ormRepository
      .createQueryBuilder('teacher')
      .innerJoin(
        'school_teachers',
        'school_teacher',
        'school_teacher.employee_id = teacher.id',
      )
      .where({})
      .groupBy('teacher.id');

    andWhere.forEach(({ condition, parameters }) => {
      queryBuilder.andWhere(condition, parameters);
    });

    const schoolTeachers = await queryBuilder.getMany();
    return schoolTeachers;
  }
}

export default TeachersRepository;
