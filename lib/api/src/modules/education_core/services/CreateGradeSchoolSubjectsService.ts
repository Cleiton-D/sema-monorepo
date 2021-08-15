import { inject, injectable } from 'tsyringe';

import CreateSchoolReportsToEnrollService from '@modules/enrolls/services/CreateSchoolReportsToEnrollService';

import IEnrollsRepository from '@modules/enrolls/repositories/IEnrollsRepository';
import GradeSchoolSubject from '../infra/typeorm/entities/GradeSchoolSubject';
import IGradeSchoolSubjectsRepository from '../repositories/IGradeSchoolSubjectsRepository';

type SchoolSubject = {
  school_subject_id: string;
  workload: number;
};

type CreateGradeSchoolSubjectsRequest = {
  grade_id: string;
  school_subjects: SchoolSubject[];
};

@injectable()
class CreateGradeSchoolSubjectsService {
  constructor(
    @inject('GradeSchoolSubjectsRepository')
    private gradeSchoolSubjectsRepository: IGradeSchoolSubjectsRepository,
    @inject('EnrollsRepository') private enrollsRepository: IEnrollsRepository,
    private createSchoolReportsToEnrollService: CreateSchoolReportsToEnrollService,
  ) {}

  public async execute({
    grade_id,
    school_subjects,
  }: CreateGradeSchoolSubjectsRequest): Promise<GradeSchoolSubject[]> {
    const data = school_subjects.map(({ school_subject_id, workload }) => ({
      grade_id,
      school_subject_id,
      workload,
    }));

    const gradeSchoolSubjects = await this.gradeSchoolSubjectsRepository.createMany(
      data,
    );

    const enrolls = await this.enrollsRepository.findAll({
      grade_id,
      status: 'ACTIVE',
    });

    const schoolSubjectIds = gradeSchoolSubjects.map(
      ({ school_subject_id }) => school_subject_id,
    );
    const enrollIds = enrolls.map(({ id }) => id);

    await this.createSchoolReportsToEnrollService.execute({
      enroll_id: enrollIds,
      school_subject_id: schoolSubjectIds,
    });

    return gradeSchoolSubjects;
  }
}

export default CreateGradeSchoolSubjectsService;
