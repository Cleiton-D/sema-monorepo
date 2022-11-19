import { EnrollStatus } from '../infra/typeorm/entities/Enroll';

type FindEnrollDTO = {
  id?: string;
  status?: EnrollStatus;
  student_id?: string;
  school_id?: string;
  grade_id?: string;
  school_year_id?: string;
  classroom_id?: string;
  class_period_id?: string;
  student_name?: string;
  student_cpf?: string;
  student_nis?: string;
  student_birth_certificate?: string;
  order?: string[];
  page?: number;
  size?: number;
};

export default FindEnrollDTO;
