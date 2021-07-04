import { BranchType } from '../infra/typeorm/entities/Branch';

type CreateBranchDTO = {
  description: string;
  type: BranchType;
};

export default CreateBranchDTO;
