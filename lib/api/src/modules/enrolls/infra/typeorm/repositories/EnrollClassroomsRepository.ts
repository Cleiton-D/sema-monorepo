import { FindConditions, getRepository, Repository, In } from 'typeorm';

import IEnrollClassroomsRepository from '@modules/enrolls/repositories/IEnrollClassroomsRepository';
import FindEnrollClassroomDTO from '@modules/enrolls/dtos/FindEnrollClassroomDTO';
import CreateEnrollClassroomDTO from '@modules/enrolls/dtos/CreateEnrollClassroomDTO';
import EnrollClassroom from '../entities/EnrollClassroom';

class EnrollClassroomsRepository implements IEnrollClassroomsRepository {
  private ormRepository: Repository<EnrollClassroom>;

  constructor() {
    this.ormRepository = getRepository(EnrollClassroom);
  }

  public async findOne({
    classroom_id,
    enroll_id,
    status,
  }: FindEnrollClassroomDTO): Promise<EnrollClassroom | undefined> {
    const where: FindConditions<EnrollClassroom> = {};
    if (classroom_id) where.classroom_id = classroom_id;
    if (status) where.status = status;

    if (enroll_id) {
      if (Array.isArray(enroll_id)) {
        where.enroll_id = In(enroll_id);
      } else {
        where.enroll_id = enroll_id;
      }
    }

    const enrollClassroom = await this.ormRepository.findOne({
      where,
    });

    return enrollClassroom;
  }

  public async findAll({
    classroom_id,
    enroll_id,
    status,
  }: FindEnrollClassroomDTO): Promise<EnrollClassroom[]> {
    const where: FindConditions<EnrollClassroom> = {};
    if (classroom_id) where.classroom_id = classroom_id;
    if (status) where.status = status;

    if (enroll_id) {
      if (Array.isArray(enroll_id)) {
        where.enroll_id = In(enroll_id);
      } else {
        where.enroll_id = enroll_id;
      }
    }

    const enrollClassrooms = await this.ormRepository.find({
      where,
      relations: [
        'enroll',
        'enroll.grade',
        'enroll.class_period',
        'enroll.school',
      ],
    });

    return enrollClassrooms;
  }

  public async create({
    classroom_id,
    enroll_id,
    status,
  }: CreateEnrollClassroomDTO): Promise<EnrollClassroom> {
    const enrollClassroom = this.ormRepository.create({
      classroom_id,
      enroll_id,
      status,
    });
    await this.ormRepository.save(enrollClassroom);
    return enrollClassroom;
  }

  public async update(
    enrollClassroom: EnrollClassroom,
  ): Promise<EnrollClassroom> {
    await this.ormRepository.save(enrollClassroom);
    return enrollClassroom;
  }
}

export default EnrollClassroomsRepository;
