export type CountAttendancesDTO = {
  classroom_id?: string;
  enroll_id?: string;
  school_subject_id?: string | string[];
  attendance?: boolean;
  justified?: boolean;
  class_id?: string | string[];
  split_by_school_subject?: boolean;
  split_by_school_term?: boolean;
};

export type CountAttendancesResponse = {
  enroll_id: string;
  school_subject_id?: string;
  total: number;
  attendances: number;
  absences: number;
  absences_percent: number;
  attendances_percent: number;
};
