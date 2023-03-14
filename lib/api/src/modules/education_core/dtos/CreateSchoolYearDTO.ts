import Status from '@shared/infra/typeorm/enums/Status';

type CreateSchoolYearDTO = {
  reference_year: string;
  date_start: Date;
  date_end: Date;
  status: Status;
};

export default CreateSchoolYearDTO;
