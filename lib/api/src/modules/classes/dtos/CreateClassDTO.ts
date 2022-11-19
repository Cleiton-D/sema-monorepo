import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';
import Multiclass from '../infra/typeorm/entities/Multiclass';

type CreateClassDTO = {
  employee_id: string;
  school_subject_id?: string;
  classroom_id: string;
  period: string;
  date_start: Date;
  class_date: Date;
  taught_content: string;
  school_term: SchoolTerm;
  multiclasses?: Multiclass[] | Array<{ classroom_id: string }>;
};

export default CreateClassDTO;
