import { inject, injectable } from 'tsyringe';

import CreateSchoolReportsToEnrollService from '@modules/enrolls/services/CreateSchoolReportsToEnrollService';
import IEnrollsRepository from '@modules/enrolls/repositories/IEnrollsRepository';
import Classroom from '@modules/schools/infra/typeorm/entities/Classroom';
import IClassroomsRepository from '@modules/schools/repositories/IClassroomsRepository';
import ShowClassroomTeacherSchoolSubjectsService from '@modules/schools/services/ShowClassroomTeacherSchoolSubjectsService';
import LinkClassroomTeacherSchoolSubjectsService from '@modules/schools/services/LinkClassroomTeacherSchoolSubjectsService';

import AppError from '@shared/errors/AppError';

import GradeSchoolSubject from '../infra/typeorm/entities/GradeSchoolSubject';
import IGradeSchoolSubjectsRepository from '../repositories/IGradeSchoolSubjectsRepository';
import IGradesRepository from '../repositories/IGradesRepository';
import ISchoolSubjectsRepository from '../repositories/ISchoolSubjectsRepository';
import Grade from '../infra/typeorm/entities/Grade';

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
    @inject('GradesRepository') private gradesRepository: IGradesRepository,
    @inject('GradeSchoolSubjectsRepository')
    private gradeSchoolSubjectsRepository: IGradeSchoolSubjectsRepository,
    @inject('EnrollsRepository') private enrollsRepository: IEnrollsRepository,
    private createSchoolReportsToEnrollService: CreateSchoolReportsToEnrollService,
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
    private showClassroomTeacherSchoolSubjects: ShowClassroomTeacherSchoolSubjectsService,
    private linkClassroomTeacherSchoolSubjects: LinkClassroomTeacherSchoolSubjectsService,
  ) {}

  public async execute({
    grade_id,
    school_subjects,
  }: CreateGradeSchoolSubjectsRequest): Promise<GradeSchoolSubject[]> {
    const grade = await this.gradesRepository.findById(grade_id);
    if (!grade) {
      throw new AppError('Grade not found');
    }

    let multidisciplinary_grade_school_subject: GradeSchoolSubject | undefined;
    if (grade.is_multidisciplinary) {
      multidisciplinary_grade_school_subject =
        await this.gradeSchoolSubjectsRepository.findOne({
          grade_id,
          is_multidisciplinary: true,
        });
    }

    const promises = school_subjects.map(
      async ({ school_subject_id, workload }) => {
        if (grade.is_multidisciplinary) {
          const schoolSubject = await this.schoolSubjectsRepository.findByid(
            school_subject_id,
          );
          if (!schoolSubject) {
            throw new AppError('School Subject not found');
          }

          if (
            schoolSubject.is_multidisciplinary &&
            multidisciplinary_grade_school_subject &&
            schoolSubject.id !==
              multidisciplinary_grade_school_subject.school_subject_id
          ) {
            throw new AppError(
              'Already exist a multidisciplinary school subject to this grade',
            );
          }

          if (schoolSubject.is_multidisciplinary) {
            return {
              grade_id,
              school_subject_id,
              workload,
            };
          }

          if (!multidisciplinary_grade_school_subject) {
            throw new AppError('Grade School subject not found');
          }

          return {
            grade_id,
            school_subject_id,
            workload: multidisciplinary_grade_school_subject.workload,
          };
        }

        return {
          grade_id,
          school_subject_id,
          workload,
        };
      },
    );

    const createData = await Promise.all(promises);
    const gradeSchoolSubjects =
      await this.gradeSchoolSubjectsRepository.createMany(createData);

    const enrolls = await this.enrollsRepository.findAll({
      grade_id,
      status: 'ACTIVE',
    });

    const schoolSubjectIds = gradeSchoolSubjects.map(
      ({ school_subject_id }) => school_subject_id,
    );
    const enrollIds = enrolls.items.map(({ id }) => id);

    await this.createSchoolReportsToEnrollService.execute({
      enroll_id: enrollIds,
      school_subject_id: schoolSubjectIds,
    });

    if (grade.is_multidisciplinary) {
      await this.createClassroomsTeacherSchoolSubjects(grade, schoolSubjectIds);
    }

    return gradeSchoolSubjects;
  }

  private async createClassroomTeacherSchoolSubjects(
    classroom: Classroom,
    multidisciplinaryGradeSchoolSubject: GradeSchoolSubject,
    schoolSubjectIds: string[],
  ) {
    const classroomTeacherSchoolSubject =
      await this.showClassroomTeacherSchoolSubjects.execute({
        classroom_id: classroom.id,
        school_subject_id:
          multidisciplinaryGradeSchoolSubject.school_subject_id,
      });
    if (!classroomTeacherSchoolSubject) return;

    const requestObject = schoolSubjectIds.map(schoolSubjectId => ({
      employee_id: classroomTeacherSchoolSubject.employee_id,
      school_subject_id: schoolSubjectId,
    }));

    await this.linkClassroomTeacherSchoolSubjects.execute({
      classroom_id: classroom.id,
      teacher_school_subjects: requestObject,
    });
  }

  private async createClassroomsTeacherSchoolSubjects(
    grade: Grade,
    schoolSubjectIds: string[],
  ) {
    const gradeSchoolSubject = await this.gradeSchoolSubjectsRepository.findOne(
      {
        grade_id: grade.id,
        is_multidisciplinary: true,
      },
    );
    if (!gradeSchoolSubject) return;

    const { items: classrooms } = await this.classroomsRepository.findAll({
      grade_id: grade.id,
    });

    const promises = classrooms.map(classroom =>
      this.createClassroomTeacherSchoolSubjects(
        classroom,
        gradeSchoolSubject,
        schoolSubjectIds,
      ),
    );

    await Promise.all(promises);
  }
}

export default CreateGradeSchoolSubjectsService;
