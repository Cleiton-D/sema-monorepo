import { TermPeriodStatus } from '../infra/typeorm/entities/SchoolTermPeriod';

type FindSchoolTermPeriodDTO = {
  id?: string;
  school_year_id?: string;
  status?: TermPeriodStatus;
};

export default FindSchoolTermPeriodDTO;
