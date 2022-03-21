type FindSchoolReportDTO = {
  enroll_id?: string | string[];
  school_subject_id?: string;
  school_year_id?: string;
  student_id?: string;
  enroll_as?: 'all' | 'last' | 'first';
};

export default FindSchoolReportDTO;
