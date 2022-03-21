import { ClassStatus } from '../infra/typeorm/entities/Class';

type FindClassDTO = {
  classroom_id?: string;
  school_subject_id?: string;
  employee_id?: string;
  school_id?: string;
  class_date?: string;
  class_period_id?: string;
  grade_id?: string;
  status?: ClassStatus;
  taught_content?: string;
  limit?: number;
  sortBy?: string;
  order?: 'DESC' | 'ASC';
};

export default FindClassDTO;
