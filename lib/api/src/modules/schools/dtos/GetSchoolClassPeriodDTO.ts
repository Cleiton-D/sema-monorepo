import { ClassPeriodType } from '@modules/education_core/infra/typeorm/entities/ClassPeriod';

type GetSchoolClassPeriodDTO = {
  school_id?: string;
  school_year_id?: string;
  class_period_id?: string;
  period?: ClassPeriodType;
};

export default GetSchoolClassPeriodDTO;
