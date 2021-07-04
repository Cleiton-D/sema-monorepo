import SchoolTerm from '@shared/infra/typeorm/enums/SchoolTerm';

type FindSchoolReportDTO = {
  enroll_id?: string | string[];
  school_subject_id?: string;
  average?: number;
  school_term?: SchoolTerm;
};

export default FindSchoolReportDTO;
