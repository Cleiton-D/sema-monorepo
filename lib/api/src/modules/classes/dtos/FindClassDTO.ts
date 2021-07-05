type FindClassDTO = {
  classroom_id?: string;
  school_subject_id?: string;
  employee_id?: string;
  limit?: number;
  sortBy?: string;
  order?: 'DESC' | 'ASC';
};

export default FindClassDTO;
