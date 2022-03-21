import { delay, inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ClassroomTeacherSchoolSubject from '../infra/typeorm/entities/ClassroomTeacherSchoolSubject';
import IClassroomsRepository from '../repositories/IClassroomsRepository';
import IClassroomTeacherSchoolSubjectsRepository from '../repositories/IClassroomTeacherSchoolSubjectsRepository';
import CreateClassroomTeacherSchoolSubjectDTO from '../dtos/CreateClassroomTeacherSchoolSubjectDTO';
import ListTimetablesService from './ListTimetablesService';
import UpdateTimetablesService, {
  UpdateTimetablesRequest,
} from './UpdateTimetablesService';

type LinkClassroomTeacherSchoolSubjectsRequest = {
  classroom_id: string;
  teacher_school_subjects: Array<{
    employee_id: string;
    school_subject_id: string;
  }>;
};

type MappedCreateClassroomTeacherSchoolSubjects = {
  newItems: CreateClassroomTeacherSchoolSubjectDTO[];
  deleteItems: ClassroomTeacherSchoolSubject[];
};

@injectable()
class LinkClassroomTeacherSchoolSubjectsService {
  constructor(
    @inject('ClassroomTeacherSchoolSubjectsRepository')
    private classroomTeacherSchoolSubjectsRepository: IClassroomTeacherSchoolSubjectsRepository,
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
    private listTimetables: ListTimetablesService,
    @inject(delay(() => UpdateTimetablesService))
    private updateTimetables: UpdateTimetablesService,
  ) {}

  public async execute({
    classroom_id,
    teacher_school_subjects,
  }: LinkClassroomTeacherSchoolSubjectsRequest): Promise<
    ClassroomTeacherSchoolSubject[]
  > {
    // TODO: criar validacoes para esse cara
    const classroom = await this.classroomsRepository.findById(classroom_id);
    if (!classroom) {
      throw new AppError('Classroom not found');
    }

    const currentClassroomTeacherSchoolSubjects = await this.classroomTeacherSchoolSubjectsRepository.findAll(
      {
        classroom_id,
      },
    );

    const {
      deleteItems,
      newItems,
    } = teacher_school_subjects.reduce<MappedCreateClassroomTeacherSchoolSubjects>(
      (acc, item) => {
        const delItems = [...acc.deleteItems];
        const nwItems = [...acc.newItems];

        const existExact = currentClassroomTeacherSchoolSubjects.some(
          ({ school_subject_id, employee_id }) =>
            school_subject_id === item.school_subject_id &&
            employee_id === item.employee_id,
        );
        if (existExact) return acc;

        const existentClassroomTeacherSchoolSubject = currentClassroomTeacherSchoolSubjects.find(
          ({ school_subject_id, employee_id }) =>
            school_subject_id === item.school_subject_id &&
            employee_id !== item.employee_id,
        );

        if (existentClassroomTeacherSchoolSubject) {
          delItems.push(existentClassroomTeacherSchoolSubject);
        }

        const newItem = {
          classroom_id,
          employee_id: item.employee_id,
          school_subject_id: item.school_subject_id,
        };

        return {
          ...acc,
          deleteItems: [...delItems],
          newItems: [...nwItems, newItem],
        };
      },
      {
        newItems: [],
        deleteItems: [],
      },
    );

    await this.classroomTeacherSchoolSubjectsRepository.deleteMany(deleteItems);
    const timetables = await Promise.all(
      deleteItems.map(item =>
        this.listTimetables.execute({
          classroom_id: item.classroom_id,
          employee_id: item.employee_id,
          school_subject_id: item.school_subject_id,
        }),
      ),
    );

    const timetablesToDelete = timetables.reduce<UpdateTimetablesRequest[]>(
      (acc, item) => {
        const items = item.map(timetable => ({
          id: timetable.id,
          day_of_week: timetable.day_of_week,
          time_start: timetable.time_start,
          time_end: timetable.time_end,
        }));

        return [...acc, ...items];
      },
      [],
    );

    if (timetablesToDelete.length > 0) {
      await this.updateTimetables.execute({
        classroom_id,
        timetables: timetablesToDelete,
      });
    }

    const classroomTeacherSchoolSubjects = await this.classroomTeacherSchoolSubjectsRepository.createMany(
      newItems,
    );

    return classroomTeacherSchoolSubjects;
  }
}

export default LinkClassroomTeacherSchoolSubjectsService;
