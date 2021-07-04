import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Branch, { BranchType } from '../infra/typeorm/entities/Branch';
import IBranchRepository from '../repositories/IBranchRepository';

type ShowBranchRequest = {
  branch_id?: string | 'me';
  profileBranchId?: string;
  type?: BranchType;
};

@injectable()
class ShowBranchService {
  constructor(
    @inject('BranchRepository') private branchRepository: IBranchRepository,
  ) {}

  public async execute({
    branch_id,
    profileBranchId,
    type,
  }: ShowBranchRequest): Promise<Branch> {
    if (branch_id === 'me' && !profileBranchId) {
      throw new AppError('This profile is not associated with a branch');
    }

    const branch = await this.branchRepository.findOne({
      id: branch_id === 'me' ? profileBranchId : branch_id,
      type,
    });
    if (!branch) {
      throw new AppError('Branch not found');
    }

    return branch;
  }
}

export default ShowBranchService;
