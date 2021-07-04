import Person from '@modules/persons/infra/typeorm/entities/Person';

import { EnrollStatus } from '../infra/typeorm/entities/Enroll';

type CreateEnrollDTO = {
  person_id?: string;
  person?: Person;
  school_id: string;
  grade_id: string;
  classroom_id: string;
  school_year_id: string;
  status: EnrollStatus;
};

export default CreateEnrollDTO;
