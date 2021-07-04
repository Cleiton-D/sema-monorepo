import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';

type CreateSchoolTermPeriodDTO = {
  school_year_id: string;
  school_term: SchoolTerm;
  date_start: Date;
  date_end: Date;
};

export default CreateSchoolTermPeriodDTO;
