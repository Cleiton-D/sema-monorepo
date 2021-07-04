import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';

type CreateSchoolReportDTO = {
  enroll_id: string;
  school_subject_id: string;
  school_term: SchoolTerm;
};

export default CreateSchoolReportDTO;
