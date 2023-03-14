type FindGradeSchoolSubjectDTO = {
  id?: string;
  school_subject_id?: string | string[];
  grade_id?: string | string[];
  workload?: number;
  is_multidisciplinary?: boolean;
  include_multidisciplinary?: boolean;
};

export default FindGradeSchoolSubjectDTO;
