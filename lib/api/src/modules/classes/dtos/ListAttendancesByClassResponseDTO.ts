import Attendance from '../infra/typeorm/entities/Attendance';
import Class from '../infra/typeorm/entities/Class';

type MinifiedClass = Pick<
  Class,
  'id' | 'period' | 'class_date' | 'school_term'
>;
type MinifiedAttendance = Pick<
  Attendance,
  'id' | 'enroll_id' | 'class_id' | 'attendance' | 'enroll_classroom_id'
>;

type ListAttendancesByClassResponseDTO = {
  classes: MinifiedClass[];
  attendances: MinifiedAttendance[];
};

export default ListAttendancesByClassResponseDTO;
