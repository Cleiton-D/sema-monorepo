type FindAttendanceDTO = {
  id?: string;
  enroll_id?: string;
  class_id?: string | string[];
  attendance?: boolean;
  classroom_id?: string;
  justified?: boolean;
};

export default FindAttendanceDTO;
