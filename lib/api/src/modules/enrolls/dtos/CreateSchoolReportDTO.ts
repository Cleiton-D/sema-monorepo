type CreateSchoolReportDTO = {
  enroll_id: string;
  school_subject_id: string;

  first?: number;
  second?: number;
  first_rec?: number;
  third?: number;
  fourth?: number;
  second_rec?: number;
  exam?: number;
  final_average?: number;
};

export default CreateSchoolReportDTO;
