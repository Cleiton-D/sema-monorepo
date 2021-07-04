import { EnrollStatus } from '../infra/typeorm/entities/Enroll';

type FindEnrollDTO = {
  id?: string;
  status?: EnrollStatus;
  person_id?: string;
  school_id?: string;
  grade_id?: string;
  school_year_id?: string;
  classroom_id?: string;
};

export default FindEnrollDTO;
