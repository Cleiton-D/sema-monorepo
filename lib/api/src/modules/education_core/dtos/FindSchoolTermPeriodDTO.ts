import { TermPeriodStatus } from '../infra/typeorm/entities/SchoolTermPeriod';

type FindSchoolTermPeriodDTO = {
  id?: string;
  school_year_id?: string;
  contain_date?: Date;
  status?: TermPeriodStatus | TermPeriodStatus[];
};

export default FindSchoolTermPeriodDTO;
