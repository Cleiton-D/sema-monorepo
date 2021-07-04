import { BranchType } from '../infra/typeorm/entities/Branch';

type CreateAccessLevelDTO = {
  description: string;
  code: string;
  only_on: BranchType;
};

export default CreateAccessLevelDTO;
