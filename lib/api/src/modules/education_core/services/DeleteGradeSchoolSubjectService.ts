import { inject, injectable } from 'tsyringe';

import ListClassroomsService from '@modules/schools/services/ListClassroomsService';
import Classroom from '@modules/schools/infra/typeorm/entities/Classroom';

import AppError from '@shared/errors/AppError';

import ShowClassroomTeacherSchoolSubjectsService from '@modules/schools/services/ShowClassroomTeacherSchoolSubjectsService';
import DeleteClassroomTeacherSchoolSubjectService from '@modules/schools/services/DeleteClassroomTeacherSchoolSubjectService';
import GradeSchoolSubject from '../infra/typeorm/entities/GradeSchoolSubject';
import IGradeSchoolSubjectsRepository from '../repositories/IGradeSchoolSubjectsRepository';

type DeleteGradeSchoolSubjectRequest = {
  grade_school_subject_id: string;
};

@injectable()
class DeleteGradeSchoolSubjectService {
  constructor(
    @inject('GradeSchoolSubjectsRepository')
    private gradeSchoolSubjectsRepository: IGradeSchoolSubjectsRepository,
    private listClassrooms: ListClassroomsService,
    private showClassroomTeacherSchoolSubject: ShowClassroomTeacherSchoolSubjectsService,
    private deleteClassroomTeacherSchoolSubject: DeleteClassroomTeacherSchoolSubjectService,
  ) {}

  public async execute({
    grade_school_subject_id,
  }: DeleteGradeSchoolSubjectRequest): Promise<void> {
    const gradeSchoolSubject = await this.gradeSchoolSubjectsRepository.findOne(
      { id: grade_school_subject_id, include_multidisciplinary: true },
    );
    if (!gradeSchoolSubject) {
      throw new AppError('Grade School Subject not found');
    }

    await this.gradeSchoolSubjectsRepository.delete(gradeSchoolSubject);
    await this.removeClassroomsTeacherSchoolSubjects(gradeSchoolSubject);
  }

  private async removeClassroomTeacherSchoolSubject(
    gradeSchoolSubject: GradeSchoolSubject,
    classroom: Classroom,
  ) {
    const classroomTeacherSchoolSubject =
      await this.showClassroomTeacherSchoolSubject.execute({
        classroom_id: classroom.id,
        school_subject_id: gradeSchoolSubject.school_subject_id,
      });
    if (!classroomTeacherSchoolSubject) return;

    await this.deleteClassroomTeacherSchoolSubject.execute({
      classroom_teacher_school_subject_id: classroomTeacherSchoolSubject.id,
    });
  }

  private async removeClassroomsTeacherSchoolSubjects(
    gradeSchoolSubject: GradeSchoolSubject,
  ) {
    const { items: classrooms } = await this.listClassrooms.execute({
      grade_id: gradeSchoolSubject.grade_id,
    });

    const promises = classrooms.map(classroom =>
      this.removeClassroomTeacherSchoolSubject(gradeSchoolSubject, classroom),
    );

    await Promise.all(promises);
  }
}

export default DeleteGradeSchoolSubjectService;
