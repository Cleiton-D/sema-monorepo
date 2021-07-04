import { inject, injectable } from 'tsyringe';

import ISchoolSubjectsRepository from '@modules/education_core/repositories/ISchoolSubjectsRepository';
import IGradeSchoolSubjectsRepository from '@modules/education_core/repositories/IGradeSchoolSubjectsRepository';

import AppError from '@shared/errors/AppError';

import IClassroomsRepository from '../repositories/IClassroomsRepository';
import ITimetablesRepository from '../repositories/ITimetablesRepository';
import Classroom from '../infra/typeorm/entities/Classroom';
import Timetable from '../infra/typeorm/entities/Timetable';

type TimetablesRequest = {
  school_subject_id: string;
  timetable_id: string;
};

type LinkSchoolSubjectsWithTimetablesRequest = {
  classroom_id: string;
  timetables: TimetablesRequest[];
};

@injectable()
class LinkSchoolSubjectsWithTimetablesService {
  constructor(
    @inject('TimetablesRepository')
    private timetablesRepository: ITimetablesRepository,
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
    @inject('GradeSchoolSubjectsRepository')
    private gradeSchoolSubjectsRepository: IGradeSchoolSubjectsRepository,
  ) {}

  public async execute({
    classroom_id,
    timetables: timetablesData,
  }: LinkSchoolSubjectsWithTimetablesRequest): Promise<Timetable[]> {
    const classroom = await this.classroomsRepository.findById(classroom_id);
    if (!classroom) {
      throw new AppError('Classroom not found');
    }

    const validationPromises = timetablesData.map<Promise<void>>(timetable =>
      this.validateTimetable(classroom, timetable),
    );
    await Promise.all(validationPromises);

    const timetableIds = timetablesData.map(({ timetable_id }) => timetable_id);
    const timetables = await this.timetablesRepository.findByIds(timetableIds);

    const newTimetables = timetables.map(timetable => {
      const dataFromRequest = timetablesData.find(
        ({ timetable_id }) => timetable_id === timetable.id,
      );
      if (!dataFromRequest) return timetable;

      return Object.assign(timetable, {
        school_subject_id: dataFromRequest.school_subject_id,
        school_subject: undefined,
      });
    });

    const updatedTimetables = await this.timetablesRepository.updateMany(
      newTimetables,
    );
    return updatedTimetables;
  }

  private async validateTimetable(
    classroom: Classroom,
    timetable: TimetablesRequest,
  ): Promise<void> {
    const { school_subject_id } = timetable;

    const schoolSubject = await this.schoolSubjectsRepository.findByid(
      school_subject_id,
    );
    if (!schoolSubject) {
      throw new AppError('SchoolSubject not found');
    }

    const gradeSchoolSubject = await this.gradeSchoolSubjectsRepository.find({
      grade_id: classroom.grade_id,
      school_year_id: classroom.school_year_id,
      school_subject_id,
    });
    if (!gradeSchoolSubject.length) {
      throw new AppError('classroom not linked with school subject');
    }
  }
}

export default LinkSchoolSubjectsWithTimetablesService;
