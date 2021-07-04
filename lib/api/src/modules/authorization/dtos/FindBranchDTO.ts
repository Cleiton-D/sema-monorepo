import { BranchType } from '../infra/typeorm/entities/Branch';

type FindBranchDTO = {
  id?: string;
  type?: BranchType;
};

export default FindBranchDTO;
