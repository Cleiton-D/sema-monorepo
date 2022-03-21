type CreateClassroomDTO = {
  description: string;
  class_period_id: string;
  school_id: string;
  grade_id?: string;
  school_year_id: string;
  capacity?: number;
  is_multigrade?: boolean;
};

export default CreateClassroomDTO;
