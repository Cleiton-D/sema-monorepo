type FindGradeSchoolSubjectDTO = {
  id?: string;
  school_subject_id?: string;
  grade_id?: string;
  workload?: number;
  is_multidisciplinary?: boolean;
  include_multidisciplinary?: boolean;
};

export default FindGradeSchoolSubjectDTO;
