import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';
import { ClassStatus } from '../infra/typeorm/entities/Class';

type FindClassDTO = {
  classroom_id?: string;
  school_subject_id?: string;
  employee_id?: string;
  school_id?: string;
  class_date?: string;
  class_period_id?: string;
  school_year_id?: string;
  grade_id?: string;
  status?: ClassStatus;
  taught_content?: string;
  school_term?: SchoolTerm;
  limit?: number;
  sortBy?: string;
  order?: 'DESC' | 'ASC';
  before?: string;
  page?: number;
  size?: number;
  period?: string;
  id?: string;
};

export default FindClassDTO;
