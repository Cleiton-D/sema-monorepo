import { inject, injectable } from 'tsyringe';

import IAttendancesRepository from '../repositories/IAttendancesRepository';

type CountAttendancesResquest = {
  class_id?: string | string[] | 'all';
  classroom_id?: string;
  enroll_id?: string;
  school_subject_id?: string | string[];
  attendance?: boolean;
  split_by_school_subject?: boolean;
  split_by_school_term?: boolean;
};

type CountAttendancesResponse = {
  enroll_id: string;
  school_subject_id?: string;
  attendances: number;
};

@injectable()
class CountAttendancesService {
  constructor(
    @inject('AttendancesRepository')
    private attendancesRepository: IAttendancesRepository,
  ) {}

  public async execute({
    class_id,
    classroom_id,
    enroll_id,
    school_subject_id,
    attendance,
    split_by_school_subject,
    split_by_school_term,
  }: CountAttendancesResquest): Promise<CountAttendancesResponse[]> {
    const attendances = await this.attendancesRepository.count({
      class_id: class_id === 'all' ? undefined : class_id,
      classroom_id,
      enroll_id,
      school_subject_id,
      attendance,
      split_by_school_subject,
      split_by_school_term,
    });

    return attendances;
  }
}

export default CountAttendancesService;
