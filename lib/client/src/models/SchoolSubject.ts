export type SchoolSubject = {
  id: string;
  description: string;
  additional_description: string;
  index: number;
  is_multidisciplinary: boolean;
};

export type SchoolSubjectForm = {
  id?: string;
  description: string;
  additional_description: string;
  school_year_id: string;
  index: number;
};
