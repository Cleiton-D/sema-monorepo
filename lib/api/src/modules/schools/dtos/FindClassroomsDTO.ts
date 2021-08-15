import { ClassPeriodType } from '../infra/typeorm/entities/Classroom';

type FindClassroomsDTO = {
  description?: string;
  class_period?: ClassPeriodType;
  school_id?: string;
  grade_id?: string;
  school_year_id?: string;
};

export default FindClassroomsDTO;
