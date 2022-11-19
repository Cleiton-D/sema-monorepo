type FindAttendanceDTO = {
  enroll_id?: string;
  class_id?: string | string[];
  attendance?: boolean;
  classroom_id?: string;
};

export default FindAttendanceDTO;
