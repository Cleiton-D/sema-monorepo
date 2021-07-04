import CreateBranchDTO from '../dtos/CreateBranchDTO';
import FindBranchDTO from '../dtos/FindBranchDTO';
import Branch from '../infra/typeorm/entities/Branch';

export default interface IBranchRepository {
  findOne: (filters: FindBranchDTO) => Promise<Branch | undefined>;
  findAll: (filters: FindBranchDTO) => Promise<Branch[]>;
  create: (date: CreateBranchDTO) => Promise<Branch>;
  update: (branch: Branch) => Promise<Branch>;
}
