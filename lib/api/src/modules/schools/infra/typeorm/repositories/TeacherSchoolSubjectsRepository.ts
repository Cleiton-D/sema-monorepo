import { FindConditions, getRepository, Repository, In } from 'typeorm';

import ITeacherSchoolSubjectsRepository from '@modules/schools/repositories/ITeacherSchoolSubjectsRepository';

import CreateTeacherSchoolSubjectDTO from '@modules/schools/dtos/CreateTeacherSchoolSubjectDTO';
import FindTeacherSchoolSubjectDTO from '@modules/schools/dtos/FindTeacherSchoolSubjectDTO';
import TeacherSchoolSubject from '../entities/TeacherSchoolSubject';

class TeacherSchoolSubjectsRepository
  implements ITeacherSchoolSubjectsRepository {
  private ormRepository: Repository<TeacherSchoolSubject>;

  constructor() {
    this.ormRepository = getRepository(TeacherSchoolSubject);
  }

  public async findById(
    teacher_school_subject_id: string,
  ): Promise<TeacherSchoolSubject | undefined> {
    const teacherSchoolSubject = await this.ormRepository.findOne(
      teacher_school_subject_id,
    );

    return teacherSchoolSubject;
  }

  public async findAll({
    school_id,
    school_subject_id,
    employee_id,
  }: FindTeacherSchoolSubjectDTO): Promise<TeacherSchoolSubject[]> {
    const where: FindConditions<TeacherSchoolSubject> = {};
    if (school_id) where.school_id = school_id;
    if (employee_id) where.employee_id = employee_id;
    if (school_subject_id) {
      if (Array.isArray(school_subject_id)) {
        where.school_subject_id = In(school_subject_id);
      } else {
        where.school_subject_id = school_subject_id;
      }
    }

    const schoolSubjects = await this.ormRepository.find({
      where,
      relations: ['employee', 'employee.person'],
    });
    return schoolSubjects;
  }

  public async create({
    employee_id,
    school_subject_id,
    school_id,
  }: CreateTeacherSchoolSubjectDTO): Promise<TeacherSchoolSubject> {
    const teacherSchoolSubject = this.ormRepository.create({
      employee_id,
      school_subject_id,
      school_id,
    });

    await this.ormRepository.save(teacherSchoolSubject);
    return teacherSchoolSubject;
  }

  public async createMany(
    data: CreateTeacherSchoolSubjectDTO[],
  ): Promise<TeacherSchoolSubject[]> {
    const teacherSchoolSubjects = data.map(
      ({ employee_id, school_subject_id, school_id }) =>
        this.ormRepository.create({
          employee_id,
          school_subject_id,
          school_id,
        }),
    );

    await this.ormRepository.save(teacherSchoolSubjects);
    return teacherSchoolSubjects;
  }

  public async delete(
    teacherSchoolSubject: TeacherSchoolSubject,
  ): Promise<void> {
    await this.ormRepository.softRemove(teacherSchoolSubject);
  }
}

export default TeacherSchoolSubjectsRepository;
