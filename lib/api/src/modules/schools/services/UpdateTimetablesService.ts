import { delay, inject, injectable } from 'tsyringe';

import ISchoolSubjectsRepository from '@modules/education_core/repositories/ISchoolSubjectsRepository';
import IGradeSchoolSubjectsRepository from '@modules/education_core/repositories/IGradeSchoolSubjectsRepository';

import AppError from '@shared/errors/AppError';

import IClassroomsRepository from '../repositories/IClassroomsRepository';
import ITimetablesRepository from '../repositories/ITimetablesRepository';
import Classroom from '../infra/typeorm/entities/Classroom';
import Timetable, { DayOfWeek } from '../infra/typeorm/entities/Timetable';
import ValidateTimetableService from './ValidateTimetableService';
import ShowClassroomTeacherSchoolSubjectsService from './ShowClassroomTeacherSchoolSubjectsService';
import LinkClassroomTeacherSchoolSubjectsService from './LinkClassroomTeacherSchoolSubjectsService';

export type UpdateTimetablesRequest = {
  id?: string;
  school_subject_id?: string;
  employee_id?: string;
  day_of_week: DayOfWeek;
  time_start: string;
  time_end: string;
};

type LinkSchoolSubjectsWithTimetablesRequest = {
  classroom_id: string;
  timetables: UpdateTimetablesRequest[];
};

type EditTimetableReduce = {
  updateItems: Timetable[];
  deleteItems: Timetable[];
};

@injectable()
class UpdateTimetablesService {
  constructor(
    @inject('TimetablesRepository')
    private timetablesRepository: ITimetablesRepository,
    @inject('ClassroomsRepository')
    private classroomsRepository: IClassroomsRepository,
    @inject('SchoolSubjectsRepository')
    private schoolSubjectsRepository: ISchoolSubjectsRepository,
    @inject('GradeSchoolSubjectsRepository')
    private gradeSchoolSubjectsRepository: IGradeSchoolSubjectsRepository,
    private validateTimetableService: ValidateTimetableService,
    private showClassroomTeacherSchoolSubjects: ShowClassroomTeacherSchoolSubjectsService,
    @inject(delay(() => LinkClassroomTeacherSchoolSubjectsService))
    private linkClassroomTeacherSchoolSubjects: LinkClassroomTeacherSchoolSubjectsService,
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

    const currentTimetables = await this.timetablesRepository.findAll({
      classroom_id,
    });

    const newItems = timetablesData
      .filter(({ id, employee_id, school_subject_id }) => {
        return !id && !!employee_id && !!school_subject_id;
      })
      .map(item => ({
        classroom_id,
        school_subject_id: item.school_subject_id!,
        employee_id: item.employee_id!,
        day_of_week: item.day_of_week,
        time_start: item.time_start,
        time_end: item.time_end,
      }));

    const editTimetables = currentTimetables.reduce<EditTimetableReduce>(
      (acc, item) => {
        const { updateItems: upte, deleteItems: dlte } = acc;

        const isUpdating = timetablesData.find(({ id }) => id === item.id);
        if (!isUpdating) return acc;

        const { school_subject_id, employee_id } = isUpdating;
        const isEmpty = !school_subject_id && !employee_id;
        if (isEmpty) {
          dlte.push(item);
        } else {
          const newItem = Object.assign(item, {
            school_subject_id: isUpdating.school_subject_id,
            school_subject: undefined,
            employee_id: isUpdating.employee_id,
            employee: undefined,
            day_of_week: isUpdating.day_of_week,
            time_start: isUpdating.time_start,
            time_end: isUpdating.time_end,
          });
          upte.push(newItem);
        }

        return { ...acc, updateItems: upte, deleteItems: dlte };
      },
      {
        updateItems: [],
        deleteItems: [],
      },
    );

    const { updateItems, deleteItems } = editTimetables;
    const insertItems = [...updateItems, ...newItems];

    const existentItems = await Promise.all(
      insertItems.map(item =>
        this.verifyExistent(classroom, {
          day_of_week: item.day_of_week,
          employee_id: item.employee_id,
          time_start: item.time_start,
          time_end: item.time_end,
        }),
      ),
    );

    const removeExistentItems = existentItems.filter(
      item => !!item,
    ) as Timetable[];

    await this.timetablesRepository.deleteMany([
      ...deleteItems,
      ...removeExistentItems,
    ]);

    const [createdItems, updatedItems] = await Promise.all([
      this.timetablesRepository.updateMany(updateItems),
      this.timetablesRepository.createMany(newItems),
    ]);

    await this.createClassroomTeacherSchoolSubjects(
      [...createdItems, ...updatedItems],
      classroom,
    );

    return [...createdItems, ...updatedItems];
  }

  private async validateTimetable(
    classroom: Classroom,
    timetable: UpdateTimetablesRequest,
  ): Promise<void> {
    const { school_subject_id } = timetable;
    if (!school_subject_id) return;

    const schoolSubject = await this.schoolSubjectsRepository.findByid(
      school_subject_id,
    );
    if (!schoolSubject) {
      throw new AppError('SchoolSubject not found');
    }

    const gradeSchoolSubject = await this.gradeSchoolSubjectsRepository.find({
      grade_id: classroom.grade_id,
      school_subject_id,
      include_multidisciplinary: true,
    });
    if (!gradeSchoolSubject.length) {
      throw new AppError('classroom not linked with school subject');
    }
  }

  private async verifyExistent(
    classroom: Classroom,
    timetable: UpdateTimetablesRequest,
  ): Promise<Timetable | undefined> {
    if (!timetable.employee_id) return undefined;

    const { existent } = await this.validateTimetableService.execute({
      classroom_id: classroom.id,
      day_of_week: timetable.day_of_week,
      employee_id: timetable.employee_id,
      time_start: timetable.time_start,
      time_end: timetable.time_end,
      include_current: true,
    });

    return existent;
  }

  private async createClassroomTeacherSchoolSubjects(
    timetables: Timetable[],
    classroom: Classroom,
  ): Promise<void> {
    const promises = timetables.filter(async timetable => {
      const existent = await this.showClassroomTeacherSchoolSubjects.execute({
        classroom_id: timetable.classroom_id,
        employee_id: timetable.employee_id,
        school_id: timetable.classroom_id,
      });

      return !existent;
    });

    const itemsToCreate = await Promise.all(promises);
    const requestData = itemsToCreate.map(timetable => ({
      employee_id: timetable.employee_id,
      school_subject_id: timetable.school_subject_id,
    }));

    await this.linkClassroomTeacherSchoolSubjects.execute({
      classroom_id: classroom.id,
      teacher_school_subjects: requestData,
    });
  }
}

export default UpdateTimetablesService;
