import Student from '@modules/students/infra/typeorm/entities/Student';

import { EnrollOrigin, EnrollStatus } from '../infra/typeorm/entities/Enroll';

type CreateEnrollDTO = {
  student_id?: string;
  student?: Student;
  school_id: string;
  grade_id: string;
  classroom_id?: string;
  school_year_id: string;
  status: EnrollStatus;
  origin: EnrollOrigin;
  class_period_id: string;
  enroll_date: string;
};

export default CreateEnrollDTO;
