import { ClassPeriodType } from '../infra/typeorm/entities/Classroom';

type CreateClassroomDTO = {
  description: string;
  class_period: ClassPeriodType;
  school_id: string;
  grade_id: string;
  school_year_id: string;
};

export default CreateClassroomDTO;
