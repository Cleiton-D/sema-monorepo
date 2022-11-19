import { FindOptionsWhere, Repository, In } from 'typeorm';

import { dataSource } from '@config/data_source';

import IEnrollClassroomsRepository from '@modules/enrolls/repositories/IEnrollClassroomsRepository';
import FindEnrollClassroomDTO from '@modules/enrolls/dtos/FindEnrollClassroomDTO';
import CreateEnrollClassroomDTO from '@modules/enrolls/dtos/CreateEnrollClassroomDTO';
import EnrollClassroom from '../entities/EnrollClassroom';

class EnrollClassroomsRepository implements IEnrollClassroomsRepository {
  private ormRepository: Repository<EnrollClassroom>;

  constructor() {
    this.ormRepository = dataSource.getRepository(EnrollClassroom);
  }

  private createQueryBuilder({
    classroom_id,
    enroll_id,
    status,
    with_old_multigrades,
  }: FindEnrollClassroomDTO) {
    const where: FindOptionsWhere<EnrollClassroom> = {};
    if (classroom_id) where.classroom_id = classroom_id;
    if (status) where.status = status;

    if (enroll_id) {
      if (Array.isArray(enroll_id)) {
        where.enroll_id = In(enroll_id);
      } else {
        where.enroll_id = enroll_id;
      }
    }

    const queryBuilder = this.ormRepository
      .createQueryBuilder('enroll_classroom')
      .select()
      .where(where)
      .leftJoinAndSelect('enroll_classroom.enroll', 'enroll')
      .leftJoinAndSelect('enroll.class_period', 'class_period')
      .leftJoinAndSelect('enroll.grade', 'grade')
      .leftJoinAndSelect('enroll.school', 'school')
      .leftJoinAndSelect('enroll.student', 'student')
      .leftJoinAndSelect('student.student_contacts', 'student_contacts')
      .leftJoinAndSelect('student_contacts.contact', 'student_contact')
      .leftJoinAndSelect('enroll_classroom.classroom', 'classroom')
      .addOrderBy('student.name');

    // if (classroom_id) {
    //   queryBuilder.andWhere(
    //     `enroll_classroom.classroom_id IN (
    //       SELECT clrm.id
    //         FROM classrooms clrm
    //    LEFT JOIN multigrades_classrooms multigrade_classroom ON (multigrade_classroom.classroom_id = clrm.id ${
    //      !with_old_multigrades
    //        ? `AND multigrade_classroom.deleted_at IS NULL`
    //        : ''
    //    })
    //    LEFT JOIN classrooms multigrade_owner ON (multigrade_classroom.owner_id = multigrade_owner.id ${
    //      !with_old_multigrades ? `AND multigrade_owner.deleted_at IS NULL` : ''
    //    })
    //        WHERE (clrm.is_multigrade = false AND clrm.id = :classroomId)
    //           OR (multigrade_owner.is_multigrade = true AND multigrade_owner.id = :classroomId)
    //     )`,
    //     { classroomId: classroom_id },
    //   );
    // }

    return queryBuilder;
  }

  public async findOne(
    filters: FindEnrollClassroomDTO,
  ): Promise<EnrollClassroom | undefined> {
    const queryBuilder = this.createQueryBuilder(filters);

    const enrollClassroom = await queryBuilder.getOne();

    return enrollClassroom ?? undefined;
  }

  public async findAll(
    filters: FindEnrollClassroomDTO,
  ): Promise<EnrollClassroom[]> {
    const queryBuilder = this.createQueryBuilder(filters);
    const enrollClassrooms = await queryBuilder.getMany();

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
