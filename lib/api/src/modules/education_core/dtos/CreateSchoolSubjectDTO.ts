type CreateSchoolSubjectDTO = {
  description: string;
  additional_description: string;
  index: number;
  is_multidisciplinary?: boolean;
  school_year_id?: string;
};

export default CreateSchoolSubjectDTO;
