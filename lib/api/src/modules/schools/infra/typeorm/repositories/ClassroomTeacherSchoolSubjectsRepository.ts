import {
  FindConditions,
  getRepository,
  ObjectLiteral,
  Repository,
  WhereExpression,
} from 'typeorm';

import IClassroomTeacherSchoolSubjectsRepository from '@modules/schools/repositories/IClassroomTeacherSchoolSubjectsRepository';
import CreateClassroomTeacherSchoolSubjectDTO from '@modules/schools/dtos/CreateClassroomTeacherSchoolSubjectDTO';
import FindClassroomTeacherSchoolSubjectDTO from '@modules/schools/dtos/FindClassroomTeacherSchoolSubjectDTO';
import ClassroomTeacherSchoolSubject from '../entities/ClassroomTeacherSchoolSubject';

type AndWhere = {
  condition: string;
  parameters?: ObjectLiteral;
};

class ClassroomTeacherSchoolSubjectsRepository
  implements IClassroomTeacherSchoolSubjectsRepository {
  private ormRepository: Repository<ClassroomTeacherSchoolSubject>;

  constructor() {
    this.ormRepository = getRepository(ClassroomTeacherSchoolSubject);
  }

  public async findOne({
    id,
    classroom_id,
    school_subject_id,
    employee_id,
    school_id,
  }: FindClassroomTeacherSchoolSubjectDTO): Promise<
    ClassroomTeacherSchoolSubject | undefined
  > {
    const where: FindConditions<ClassroomTeacherSchoolSubject> = {};
    const andWhere: AndWhere[] = [];

    if (id) where.id = id;
    if (classroom_id) where.classroom_id = classroom_id;
    if (school_subject_id) where.school_subject_id = school_subject_id;
    if (employee_id) where.employee_id = employee_id;
    if (school_id) {
      andWhere.push({
        condition: 'classroom.school_id = :schoolId',
        parameters: { schoolId: school_id },
      });
    }

    const classroomTeacherSchoolSubject = await this.ormRepository.findOne({
      where: (qb: WhereExpression) => {
        qb.where(where);
        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      },
      join: {
        alias: 'classroom_teacher_school_subject',
        leftJoinAndSelect: {
          employee: 'classroom_teacher_school_subject.employee',
          classroom: 'classroom_teacher_school_subject.classroom',
          school_subject: 'classroom_teacher_school_subject.school_subject',
        },
      },
    });

    return classroomTeacherSchoolSubject;
  }

  public async findAll({
    id,
    classroom_id,
    school_subject_id,
    employee_id,
    school_id,
  }: FindClassroomTeacherSchoolSubjectDTO): Promise<
    ClassroomTeacherSchoolSubject[]
  > {
    const where: FindConditions<ClassroomTeacherSchoolSubject> = {};
    const andWhere: AndWhere[] = [];

    if (id) where.id = id;
    if (classroom_id) where.classroom_id = classroom_id;
    if (school_subject_id) where.school_subject_id = school_subject_id;
    if (employee_id) where.employee_id = employee_id;
    if (school_id) {
      andWhere.push({
        condition: 'classroom.school_id = :schoolId',
        parameters: { schoolId: school_id },
      });
    }

    const classroomTeacherSchoolSubjects = await this.ormRepository.find({
      where: (qb: WhereExpression) => {
        qb.where(where);
        andWhere.forEach(({ condition, parameters }) =>
          qb.andWhere(condition, parameters),
        );
      },
      join: {
        alias: 'classroom_teacher_school_subject',
        leftJoinAndSelect: {
          employee: 'classroom_teacher_school_subject.employee',
          classroom: 'classroom_teacher_school_subject.classroom',
          school_subject: 'classroom_teacher_school_subject.school_subject',
        },
      },
    });

    return classroomTeacherSchoolSubjects;
  }

  public async create({
    classroom_id,
    employee_id,
    school_subject_id,
  }: CreateClassroomTeacherSchoolSubjectDTO): Promise<ClassroomTeacherSchoolSubject> {
    const classroomTeacherSchoolSubject = this.ormRepository.create({
      classroom_id,
      employee_id,
      school_subject_id,
    });
    await this.ormRepository.save(classroomTeacherSchoolSubject);

    return classroomTeacherSchoolSubject;
  }

  public async createMany(
    data: CreateClassroomTeacherSchoolSubjectDTO[],
  ): Promise<ClassroomTeacherSchoolSubject[]> {
    const classroomTeacherSchoolSubjects = data.map(
      ({ classroom_id, school_subject_id, employee_id }) =>
        this.ormRepository.create({
          classroom_id,
          school_subject_id,
          employee_id,
        }),
    );
    await this.ormRepository.save(classroomTeacherSchoolSubjects);

    return classroomTeacherSchoolSubjects;
  }

  public async delete(
    classroomTeacherSchoolSubject: ClassroomTeacherSchoolSubject,
  ): Promise<void> {
    await this.ormRepository.softRemove(classroomTeacherSchoolSubject);
  }

  public async deleteMany(
    items: ClassroomTeacherSchoolSubject[],
  ): Promise<void> {
    await Promise.all(items.map(item => this.ormRepository.softRemove(item)));
  }
}

export default ClassroomTeacherSchoolSubjectsRepository;
