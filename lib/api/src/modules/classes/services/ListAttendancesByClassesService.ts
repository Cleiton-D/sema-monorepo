import { injectable } from 'tsyringe';

import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';

import { ClassStatus } from '../infra/typeorm/entities/Class';
import ListClassesService from './ListClassesService';
import ListAttendancesService from './ListAttendancesService';
import ListAttendancesByClassResponseDTO from '../dtos/ListAttendancesByClassResponseDTO';

type ListClassesRequest = {
  classroom_id?: string;
  school_subject_id?: string;
  employee_id?: string;
  school_id?: string;
  class_date?: string;
  class_period_id?: string;
  grade_id?: string;
  status?: ClassStatus;
  school_term?: SchoolTerm;
  limit?: number;
  sortBy?: string;
  order?: 'DESC' | 'ASC';
  before?: string;
  enroll_id?: string;
};

@injectable()
class ListAttendancesByClassesService {
  constructor(
    private listClasses: ListClassesService,
    private listAttendances: ListAttendancesService,
  ) {}

  public async execute({
    classroom_id,
    school_subject_id,
    employee_id,
    school_id,
    class_date,
    class_period_id,
    grade_id,
    status,
    school_term,
    limit,
    sortBy,
    order,
    before,
    enroll_id,
  }: ListClassesRequest): Promise<ListAttendancesByClassResponseDTO> {
    const classes = await this.listClasses.execute({
      classroom_id,
      school_subject_id,
      employee_id,
      school_id,
      class_date,
      class_period_id,
      grade_id,
      status,
      school_term,
      limit,
      sortBy,
      order,
      before,
    });

    const classIds = classes.items.map(({ id }) => id);
    const classesResponse = classes.items.map(item => ({
      id: item.id,
      period: item.period,
      class_date: item.class_date,
      school_term: item.school_term,
    }));

    const attendances = await this.listAttendances.execute({
      class_id: classIds,
      classroom_id,
      enroll_id,
    });
    const attendancesResponse = attendances.map(item => ({
      id: item.id,
      enroll_id: item.enroll_id,
      enroll_classroom_id: item.enroll_classroom_id,
      class_id: item.class_id,
      attendance: item.attendance,
    }));

    return { classes: classesResponse, attendances: attendancesResponse };
  }
}

export default ListAttendancesByClassesService;
