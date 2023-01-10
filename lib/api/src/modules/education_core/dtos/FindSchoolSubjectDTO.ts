type FindSchoolSubjectDTO = {
  id?: string | string[];
  school_year_id?: string;
  is_multidisciplinary?: boolean;
  include_multidisciplinary?: boolean;
};

export default FindSchoolSubjectDTO;
