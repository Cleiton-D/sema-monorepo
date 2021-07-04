import { FindConditions, getRepository, Repository } from 'typeorm';

import IEnrollClassroomsRepository from '@modules/enrolls/repositories/IEnrollClassroomsRepository';
import FindEnrollClassroomDTO from '@modules/enrolls/dtos/FindEnrollClassroomDTO';
import EnrollClassroom from '../entities/EnrollClassroom';

class EnrollClassroomsRepository implements IEnrollClassroomsRepository {
  private ormRepository: Repository<EnrollClassroom>;

  constructor() {
    this.ormRepository = getRepository(EnrollClassroom);
  }

  public async findAll({
    classroom_id,
    enroll_id,
    status,
  }: FindEnrollClassroomDTO): Promise<EnrollClassroom[]> {
    const where: FindConditions<EnrollClassroom> = {};
    if (classroom_id) where.classroom_id = classroom_id;
    if (enroll_id) where.enroll_id = enroll_id;
    if (status) where.status = status;

    const enrollClassrooms = await this.ormRepository.find({
      where,
    });

    return enrollClassrooms;
  }
}

export default EnrollClassroomsRepository;
