import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';

type CreateClassDTO = {
  employee_id: string;
  school_subject_id: string;
  classroom_id: string;
  period: string;
  date_start: Date;
  class_date: Date;
  taught_content: string;
  school_term: SchoolTerm;
};

export default CreateClassDTO;
