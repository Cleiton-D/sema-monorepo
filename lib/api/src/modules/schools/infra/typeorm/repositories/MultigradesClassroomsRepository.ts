import { FindConditions, getRepository, Repository } from 'typeorm';

import IMultigradesClassroomsRepository from '@modules/schools/repositories/IMultigradesClassroomsRepository';
import FindMultigradeClassroomDTO from '@modules/schools/dtos/FindMultigradeClassroomDTO';
import CreateMultigradeClassroomDTO from '@modules/schools/dtos/CreateMultigradeClassroomDTO';
import MultigradeClassroom from '../entities/MultigradeClassroom';

class MultigradesClassroomsRepository
  implements IMultigradesClassroomsRepository {
  private ormRepository: Repository<MultigradeClassroom>;

  constructor() {
    this.ormRepository = getRepository(MultigradeClassroom);
  }

  public async findOne({
    id,
    owner_id,
  }: FindMultigradeClassroomDTO): Promise<MultigradeClassroom | undefined> {
    const where: FindConditions<MultigradeClassroom> = {};
    if (id) where.id = id;
    if (owner_id) where.owner_id = owner_id;

    const multigradeClassrooms = await this.ormRepository.findOne({
      where,
      relations: ['classroom', 'classroom.grade'],
    });
    return multigradeClassrooms;
  }

  public async findAll({
    owner_id,
  }: FindMultigradeClassroomDTO): Promise<MultigradeClassroom[]> {
    const queryBuilder = this.ormRepository.createQueryBuilder(
      'multigrade_classroom',
    );
    queryBuilder.where({ owner_id });
    queryBuilder
      .innerJoinAndSelect('multigrade_classroom.classroom', 'classroom')
      .innerJoinAndSelect('classroom.grade', 'grade')
      .innerJoinAndSelect('classroom.class_period', 'class_period')
      .innerJoinAndSelect('classroom.school', 'school')
      .loadRelationCountAndMap(
        'classroom.enroll_count',
        'classroom.enroll_classrooms',
        'enroll_classroom',
        qb =>
          qb
            .innerJoin(
              'enrolls',
              'enroll',
              'enroll.id = enroll_classroom.enroll_id',
            )
            .where("enroll.status = 'ACTIVE'")
            .andWhere("enroll_classroom.status = 'ACTIVE'"),
      );

    const multigradeClassrooms = await queryBuilder.getMany();
    return multigradeClassrooms;
  }

  public async create({
    owner_id,
    classroom_id,
  }: CreateMultigradeClassroomDTO): Promise<MultigradeClassroom> {
    const multigradeClassroom = this.ormRepository.create({
      owner_id,
      classroom_id,
    });

    await this.ormRepository.save(multigradeClassroom);
    return multigradeClassroom;
  }

  public async delete(multigradeClassroom: MultigradeClassroom): Promise<void> {
    await this.ormRepository.softRemove(multigradeClassroom);
  }
}

export default MultigradesClassroomsRepository;
