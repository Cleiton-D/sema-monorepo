type CreateSchoolSubjectDTO = {
  description: string;
  additional_description: string;
  index: number;
  is_multidisciplinary?: boolean;
};

export default CreateSchoolSubjectDTO;
