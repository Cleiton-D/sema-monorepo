import { FindConditions, getRepository, Repository, IsNull } from 'typeorm';

import IGradeSchoolSubjectsRepository from '@modules/education_core/repositories/IGradeSchoolSubjectsRepository';
import CreateGradeSchoolSubjectDTO from '@modules/education_core/dtos/CreateGradeSchoolSubjectDTO';
import FindGradeSchoolSubjectDTO from '@modules/education_core/dtos/FindGradeSchoolSubjectDTO';

import GradeSchoolSubject from '../entities/GradeSchoolSubject';

class GradeSchoolSubjectsRepository implements IGradeSchoolSubjectsRepository {
  private ormRepository: Repository<GradeSchoolSubject>;

  constructor() {
    this.ormRepository = getRepository(GradeSchoolSubject);
  }

  public async find({
    id,
    grade_id,
    school_subject_id,
    school_year_id,
    workload,
  }: FindGradeSchoolSubjectDTO): Promise<GradeSchoolSubject[]> {
    const where: FindConditions<GradeSchoolSubject> = {};

    if (id) where.id = id;
    if (grade_id) where.grade_id = grade_id;
    if (school_subject_id) where.school_subject_id = school_subject_id;
    if (school_year_id) where.school_year_id = school_year_id;
    if (workload) where.workload = workload;

    where.deleted_at = IsNull();

    const gradeSchoolSubjects = await this.ormRepository.find({
      where,
      relations: ['school_subject'],
    });

    return gradeSchoolSubjects;
  }

  public async findOne({
    grade_id,
    school_subject_id,
    school_year_id,
    workload,
  }: FindGradeSchoolSubjectDTO): Promise<GradeSchoolSubject | undefined> {
    const where: FindConditions<GradeSchoolSubject> = {};

    if (grade_id) where.grade_id = grade_id;
    if (school_subject_id) where.school_subject_id = school_subject_id;
    if (school_year_id) where.school_year_id = school_year_id;
    if (workload) where.workload = workload;

    where.deleted_at = IsNull();

    const gradeSchoolSubjects = await this.ormRepository.findOne({
      where,
    });

    return gradeSchoolSubjects;
  }

  public async create({
    grade_id,
    school_subject_id,
    school_year_id,
    workload,
  }: CreateGradeSchoolSubjectDTO): Promise<GradeSchoolSubject> {
    const gradeSchoolSubject = await this.ormRepository.create({
      grade_id,
      school_subject_id,
      school_year_id,
      workload,
    });

    await this.ormRepository.save(gradeSchoolSubject);
    return gradeSchoolSubject;
  }

  public async createMany(
    data: CreateGradeSchoolSubjectDTO[],
  ): Promise<GradeSchoolSubject[]> {
    const gradeSchoolSubjects = data.map(
      ({ grade_id, school_year_id, school_subject_id, workload }) =>
        this.ormRepository.create({
          grade_id,
          school_year_id,
          school_subject_id,
          workload,
        }),
    );

    await this.ormRepository.save(gradeSchoolSubjects);
    return gradeSchoolSubjects;
  }

  public async update(
    gradeSchoolSubject: GradeSchoolSubject,
  ): Promise<GradeSchoolSubject> {
    await this.ormRepository.save(gradeSchoolSubject);
    return gradeSchoolSubject;
  }

  public async delete(gradeSchoolSubject: GradeSchoolSubject): Promise<void> {
    await this.ormRepository.softRemove(gradeSchoolSubject);
  }
}

export default GradeSchoolSubjectsRepository;
