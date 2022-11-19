type FindClassroomsDTO = {
  description?: string;
  class_period_id?: string;
  school_id?: string;
  grade_id?: string;
  school_year_id?: string;
  employee_id?: string;
  with_in_multigrades?: boolean;
  with_multigrades?: boolean;
  page?: number;
  size?: number;
};

export default FindClassroomsDTO;
