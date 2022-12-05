import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IClassroomTeacherSchoolSubjectsRepository from '../repositories/IClassroomTeacherSchoolSubjectsRepository';
import ListTimetablesService from './ListTimetablesService';
import UpdateTimetablesService from './UpdateTimetablesService';

type DeleteClassroomTeacherSchoolSubjectRequest = {
  classroom_teacher_school_subject_id: string;
};

@injectable()
class DeleteClassroomTeacherSchoolSubjectService {
  constructor(
    @inject('ClassroomTeacherSchoolSubjectsRepository')
    private classroomTeacherSchoolSubjectsRepository: IClassroomTeacherSchoolSubjectsRepository,
    private listTimetables: ListTimetablesService,
    private updateTimetables: UpdateTimetablesService,
  ) {}

  public async execute({
    classroom_teacher_school_subject_id,
  }: DeleteClassroomTeacherSchoolSubjectRequest): Promise<void> {
    const classroomTeacherSchoolSubject =
      await this.classroomTeacherSchoolSubjectsRepository.findOne({
        id: classroom_teacher_school_subject_id,
      });
    if (!classroomTeacherSchoolSubject) {
      throw new AppError('Classroom teacher school subject not found');
    }

    await this.classroomTeacherSchoolSubjectsRepository.delete(
      classroomTeacherSchoolSubject,
    );

    const timetables = await this.listTimetables.execute({
      classroom_id: classroomTeacherSchoolSubject.classroom_id,
      employee_id: classroomTeacherSchoolSubject.employee_id,
      school_subject_id: classroomTeacherSchoolSubject.school_subject_id,
    });

    const timetablesToDelete = timetables.map(
      ({ id, day_of_week, time_start, time_end }) => ({
        id,
        day_of_week,
        time_start,
        time_end,
      }),
    );

    await this.updateTimetables.execute({
      classroom_id: classroomTeacherSchoolSubject.classroom_id,
      timetables: timetablesToDelete,
    });
  }
}

export default DeleteClassroomTeacherSchoolSubjectService;
