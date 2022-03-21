export type ClassPeriod = {
  id: string;
  description: string;
  time_start: string;
  time_end: string;
  class_time: string;
  break_time: string;
  break_time_start: string;
  school_year_id: string;
};

export type FormattedClassPeriod = ClassPeriod & {
  translated_description: string;
};

export type ClassPeriodForm = {
  description: string;
  time_start: string;
  time_end: string;
  class_time: string;
  break_time: string;
  break_time_start: string;
};
