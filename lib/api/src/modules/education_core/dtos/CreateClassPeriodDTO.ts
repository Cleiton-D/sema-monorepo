import { ClassPeriodType } from '../infra/typeorm/entities/ClassPeriod';

type CreateClassPeriodDTO = {
  school_year_id: string;
  description: ClassPeriodType;
  time_start: string;
  time_end: string;
  class_time: string;
  break_time: string;
  break_time_start: string;
};

export default CreateClassPeriodDTO;
