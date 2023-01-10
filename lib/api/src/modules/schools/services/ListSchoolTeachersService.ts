import { inject, injectable } from 'tsyringe';

import SchoolTeacher from '../infra/typeorm/entities/SchoolTeacher';
import ISchoolTeachersRepository from '../repositories/ISchoolTeachersRepository';

type ListSchoolTeachersRequest = {
  school_id: string;
  school_year_id?: string;
};

@injectable()
class ListSchoolTeachersService {
  constructor(
    @inject('SchoolTeachersRepository')
    private schoolTeachersRepository: ISchoolTeachersRepository,
  ) {}

  public async execute({
    school_id,
    school_year_id,
  }: ListSchoolTeachersRequest): Promise<SchoolTeacher[]> {
    const schoolTeachers = await this.schoolTeachersRepository.findAll({
      school_id,
      school_year_id,
    });

    return schoolTeachers;
  }
}

export default ListSchoolTeachersService;
