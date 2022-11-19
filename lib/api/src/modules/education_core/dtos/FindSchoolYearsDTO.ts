import Status from '@shared/infra/typeorm/enums/Status';

type FindSchoolYearsDTO = {
  status?: Status | Status[];
};

export default FindSchoolYearsDTO;
