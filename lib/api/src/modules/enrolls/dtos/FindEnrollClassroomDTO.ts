type FindEnrollClassroomDTO = {
  classroom_id?: string;
  enroll_id?: string | string[];
  status?: string;
  with_old_multigrades?: boolean;
};

export default FindEnrollClassroomDTO;
