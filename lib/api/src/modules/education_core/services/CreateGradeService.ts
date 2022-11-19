import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Grade from '../infra/typeorm/entities/Grade';

import IGradesRepository from '../repositories/IGradesRepository';
import ISchoolSubjectsRepository from '../repositories/ISchoolSubjectsRepository';
import CreateGradeSchoolSubjectsService from './CreateGradeSchoolSubjectsService';

type CreateGradeRequest = {
  description: string;
  after_of?: string;
  is_multidisciplinary?: boolean;
  multidisciplinary_workload?: number;
};

@injectable()
class CreateGradeService {
  constructor(
    @inject('GradesRepository') private gradesRepository: IGradesRepository,
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
    private createGradeSchoolSubject: CreateGradeSchoolSubjectsService,
  ) {}

  public async execute({
    description,
    after_of,
  }: CreateGradeRequest): Promise<Grade> {
    if (after_of) {
      const existAfterOf = await this.gradesRepository.findWithAfterOf(
        after_of,
      );

      if (existAfterOf) {
        throw new AppError('Already exist an grade after this another grade');
      }
    }

    const grade = await this.gradesRepository.create({
      description,
      after_of,
    });

    // if (is_multidisciplinary) {
    //   const schoolSubject = await this.schoolSubjectsRepository.findOne({
    //     is_multidisciplinary: true,
    //   });
    //   if (!schoolSubject) {
    //     throw new AppError('School Subject not found');
    //   }

    //   await this.createGradeSchoolSubject.execute({
    //     grade_id: grade.id,
    //     school_subjects: [
    //       {
    //         school_subject_id: schoolSubject.id,
    //         workload: multidisciplinary_workload || 0,
    //       },
    //     ],
    //   });
    // }

    return grade;
  }
}

export default CreateGradeService;
